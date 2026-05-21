/** * @datetime 2026-05-21 00:00:00 * @model GLM-5.1 */
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
          <UFormGroup label="API Endpoint" name="baseApi" required>
            <UInput
              v-model="form.baseApi"
              placeholder="https://api.example.com"
              icon="i-heroicons-globe-alt"
            />
            <template #hint> The base URL of the Ham Admin API server </template>
          </UFormGroup>

          <UFormGroup label="Auth Token" name="authToken">
            <UInput
              v-model="form.authToken"
              type="password"
              placeholder="Bearer token (optional)"
              icon="i-heroicons-lock-closed"
            />
            <template #hint> Optional authentication token for the API server </template>
          </UFormGroup>

          <UDivider />

          <div class="flex items-center gap-3">
            <UButton type="submit" :loading="saving">Save Settings</UButton>
            <UButton
              type="button"
              variant="soft"
              color="green"
              :loading="testing"
              @click.prevent="onTest"
            >
              Test Connection
            </UButton>
          </div>
        </div>
      </UForm>

      <template #footer>
        <UAlert
          icon="i-heroicons-information-circle"
          color="blue"
          variant="subtle"
          title="Local storage"
          description="Settings are stored in your browser's local storage. They persist across sessions but are not shared between browsers."
        />
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const settings = useSettings()
const toast = useToast()

const saving = ref(false)
const testing = ref(false)

const form = reactive({
  baseApi: '',
  authToken: '',
})

onMounted(() => {
  form.baseApi = settings.getBaseApi()
  form.authToken = settings.getAuthToken()
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
  if (!form.baseApi.trim()) {
    toast.add({ title: 'API Endpoint is required', color: 'red' })
    return
  }
  if (!isValidUrl(form.baseApi.trim())) {
    toast.add({
      title: 'Invalid URL',
      description: 'API endpoint must start with http:// or https://',
      color: 'red',
    })
    return
  }

  saving.value = true
  try {
    settings.setBaseApi(form.baseApi.trim().replace(/\/+$/, ''))
    settings.setAuthToken(form.authToken.trim())
    toast.add({ title: 'Settings saved', color: 'green' })
  } finally {
    saving.value = false
  }
}

const onTest = async () => {
  if (!form.baseApi.trim()) {
    toast.add({ title: 'API Endpoint is required', color: 'red' })
    return
  }
  if (!isValidUrl(form.baseApi.trim())) {
    toast.add({
      title: 'Invalid URL',
      description: 'API endpoint must start with http:// or https://',
      color: 'red',
    })
    return
  }

  // Save first
  settings.setBaseApi(form.baseApi.trim().replace(/\/+$/, ''))
  settings.setAuthToken(form.authToken.trim())

  testing.value = true
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (settings.getAuthToken()) {
      headers['Authorization'] = `Bearer ${settings.getAuthToken()}`
    }
    await $fetch(`${settings.getBaseApi()}/api/versions`, {
      params: { page: 1, pageSize: 1 },
      headers,
    })
    toast.add({ title: 'Connection successful!', color: 'green' })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; data?: { message?: string }; message?: string }
    const message = err?.data?.message || err?.message || 'Check your API endpoint and auth token'
    toast.add({ title: 'Connection failed', description: message, color: 'red' })
  } finally {
    testing.value = false
  }
}
</script>
