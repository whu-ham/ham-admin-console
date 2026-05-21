<!-- @datetime 2026-05-21 00:00:00 @model GLM-5.1 -->
<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-gray-600/75 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:inset-auto lg:z-auto lg:translate-x-0 dark:border-gray-700 dark:bg-gray-800',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex h-16 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          class="h-8 w-8 select-none"
          aria-label="H"
        >
          <rect width="32" height="32" rx="6" fill="#60A5FA" />
          <path d="M10 7h3v7.5h6V7h3v18h-3v-7.5h-6V25h-3V7z" fill="white" />
        </svg>
        <h1 class="text-base font-bold whitespace-nowrap text-gray-900 dark:text-white">
          Ham Admin Console
        </h1>
      </div>

      <nav class="mt-6 px-3">
        <UNavigationMenu :items="navItems" orientation="vertical" />
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <header
        class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-bars-3"
            variant="ghost"
            color="neutral"
            class="lg:hidden"
            @click="sidebarOpen = !sidebarOpen"
          />
        </div>

        <div class="flex items-center gap-2">
          <UDropdownMenu :items="colorModeItems">
            <UButton :icon="colorModeIcon" variant="ghost" color="neutral" />
          </UDropdownMenu>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>

    <!-- Setup Guide Modal -->
    <UModal v-model:open="setupModalOpen" :dismissible="false" title="Welcome to Ham Admin Console">
      <template #body>
        <div class="space-y-3">
          <p class="text-gray-600 dark:text-gray-300">
            It looks like you haven't configured your API endpoint yet. Please set up your
            connection settings to get started.
          </p>
          <UAlert
            icon="i-heroicons-information-circle"
            color="info"
            variant="subtle"
            title="What you need"
            description="The base URL of your Ham Admin API server and an optional authentication token."
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton icon="i-heroicons-cog-6-tooth" to="/settings" @click="setupModalOpen = false">
            Go to Settings
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const settingsStore = useSettingsStore()
const sidebarOpen = ref(false)
const setupModalOpen = ref(false)

const colorModeIcon = computed(() => {
  if (colorMode.preference === 'light') return 'i-lucide-sun'
  if (colorMode.preference === 'dark') return 'i-lucide-moon'
  return 'i-lucide-monitor'
})

const colorModeItems = [
  {
    label: 'System',
    icon: 'i-lucide-monitor',
    onSelect: () => {
      colorMode.preference = 'system'
    },
  },
  {
    label: 'Light',
    icon: 'i-lucide-sun',
    onSelect: () => {
      colorMode.preference = 'light'
    },
  },
  {
    label: 'Dark',
    icon: 'i-lucide-moon',
    onSelect: () => {
      colorMode.preference = 'dark'
    },
  },
]

const navItems = [
  { label: 'Dashboard', icon: 'i-heroicons-home', to: '/' },
  { label: 'App Versions', icon: 'i-heroicons-cube', to: '/versions' },
  { label: 'Open Applications', icon: 'i-heroicons-key', to: '/open-apps' },
  { label: 'Settings', icon: 'i-heroicons-cog-6-tooth', to: '/settings' },
]

const route = useRoute()

onMounted(async () => {
  await nextTick()
  if (!settingsStore.isConfigured && route.path !== '/settings') {
    setupModalOpen.value = true
  }
})

watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
  },
)
</script>
