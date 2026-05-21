<!-- @datetime 2026-05-21 00:00:00 @model GLM-5.1 -->
<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview of Ham Admin Console</p>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900"
          >
            <UIcon name="i-heroicons-cube" class="size-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">App Versions</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ versionCount }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900"
          >
            <UIcon name="i-heroicons-key" class="size-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Open Applications</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ openAppCount }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900"
          >
            <UIcon name="i-heroicons-server" class="size-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">API Server</p>
            <p v-if="baseApi" class="text-sm font-medium break-all text-gray-900 dark:text-white">
              {{ baseApi }}
            </p>
            <NuxtLink
              v-else
              to="/settings"
              class="text-sm font-medium text-purple-600 hover:underline dark:text-purple-400"
            >
              Click to configure →
            </NuxtLink>
          </div>
        </div>
      </UCard>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </template>
        <div class="flex flex-col gap-3">
          <UButton
            icon="i-heroicons-plus"
            label="Create App Version"
            to="/versions"
            variant="soft"
            block
          />
          <UButton
            icon="i-heroicons-plus"
            label="Create Open Application"
            to="/open-apps"
            variant="soft"
            color="success"
            block
          />
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Recent Versions</h3>
        </template>
        <div v-if="recentVersions.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
          No versions found
        </div>
        <div v-else class="flex flex-col gap-2">
          <div
            v-for="v in recentVersions"
            :key="v.id"
            class="flex items-center justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-700"
          >
            <div class="flex items-center gap-2">
              <UBadge
                :label="v.platform"
                :color="v.platform === 'android' ? 'success' : 'info'"
                variant="subtle"
                size="md"
              />
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                v.versionName
              }}</span>
            </div>
            <UBadge
              :label="v.channel"
              :color="v.channel === 'release' ? 'success' : 'warning'"
              variant="subtle"
              size="md"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppVersion, OpenAppListItem, PaginatedData } from '~/types'

const settingsStore = useSettingsStore()
const baseApi = computed(() => settingsStore.baseApi)

const versionCount = ref(0)
const openAppCount = ref(0)
const recentVersions = ref<AppVersion[]>([])

onMounted(async () => {
  settingsStore.loadFromStorage()
  try {
    const api = useApi()
    const [versionData, openAppData] = await Promise.all([
      api.get<PaginatedData<AppVersion>>('/api/versions', { page: 1, pageSize: 5 }),
      api.get<PaginatedData<OpenAppListItem>>('/api/open-apps', { page: 1, pageSize: 1 }),
    ])
    versionCount.value = versionData.total
    recentVersions.value = versionData.items
    openAppCount.value = openAppData.total
  } catch {
    // Dashboard loads silently
  }
})
</script>
