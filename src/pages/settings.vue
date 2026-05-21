<!-- @datetime 2026-05-21 00:00:00 @model GLM-5.1 -->
<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Configure API connection and authentication
      </p>
    </div>

    <UCard class="max-w-2xl">
      <UForm :state="form" @submit="onSave">
        <div class="space-y-5">
          <UFormField label="API Endpoint" name="baseApi" required>
            <UInput
              v-model="form.baseApi"
              placeholder="https://api.example.com"
              icon="i-heroicons-globe-alt"
              size="lg"
              class="w-full"
            />
            <template #hint> The base URL of the Ham Admin API server </template>
          </UFormField>

          <UFormField label="Auth Token" name="authToken">
            <UInput
              v-model="form.authToken"
              type="password"
              placeholder="Bearer token (optional)"
              icon="i-heroicons-lock-closed"
              size="lg"
              class="w-full"
            />
            <template #hint> Optional authentication token for the API server </template>
          </UFormField>

          <USeparator />

          <div class="flex items-center gap-3">
            <UButton type="submit" :loading="saving">Save Settings</UButton>
            <UButton
              type="button"
              variant="soft"
              color="success"
              :loading="testing"
              @click="onTest"
            >
              Test Connection
            </UButton>
            <UButton
              type="button"
              variant="soft"
              color="error"
              :disabled="!form.authToken"
              @click="onClearToken"
            >
              Clear Token
            </UButton>
          </div>
        </div>
      </UForm>

      <template #footer>
        <UAlert
          icon="i-heroicons-information-circle"
          color="info"
          variant="subtle"
          title="Local storage"
          description="Settings are stored in your browser's local storage. They persist across sessions but are not shared between browsers."
        />
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const settingsStore = useSettingsStore()

const saving = ref(false)
const testing = ref(false)

const form = reactive({
  baseApi: settingsStore.baseApi,
  authToken: settingsStore.authToken,
})

const isValidUrl = (url: string): boolean => {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

const onSave = () => {
  const toast = useToast()

  if (!form.baseApi.trim()) {
    toast.add({ title: 'API Endpoint is required', color: 'error' })
    return
  }
  if (!isValidUrl(form.baseApi.trim())) {
    toast.add({
      title: 'Invalid URL',
      description: 'API endpoint must start with http:// or https://',
      color: 'error',
    })
    return
  }

  saving.value = true
  try {
    settingsStore.setBaseApi(form.baseApi.trim().replace(/\/+$/, ''))
    settingsStore.setAuthToken(form.authToken.trim())
    toast.add({ title: 'Settings saved successfully', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to save settings', color: 'error' })
  } finally {
    saving.value = false
  }
}

const onTest = async () => {
  const toast = useToast()

  if (!form.baseApi.trim()) {
    toast.add({ title: 'API Endpoint is required', color: 'error' })
    return
  }
  if (!isValidUrl(form.baseApi.trim())) {
    toast.add({
      title: 'Invalid URL',
      description: 'API endpoint must start with http:// or https://',
      color: 'error',
    })
    return
  }

  // Save first
  settingsStore.setBaseApi(form.baseApi.trim().replace(/\/+$/, ''))
  settingsStore.setAuthToken(form.authToken.trim())

  testing.value = true
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (settingsStore.authToken) {
      headers['Authorization'] = `Bearer ${settingsStore.authToken}`
    }
    await $fetch(`${settingsStore.baseApi}/api/versions`, {
      params: { page: 1, pageSize: 1 },
      headers,
    })
    toast.add({ title: 'Connection successful!', color: 'success' })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; data?: { message?: string }; message?: string }
    const message = err?.data?.message || err?.message || 'Check your API endpoint and auth token'
    toast.add({ title: 'Connection failed', description: message, color: 'error' })
  } finally {
    testing.value = false
  }
}

const onClearToken = () => {
  const toast = useToast()
  form.authToken = ''
  settingsStore.clearAuthToken()
  toast.add({ title: 'Auth token cleared', color: 'success' })
}
</script>
