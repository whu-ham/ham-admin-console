/** * @datetime 2026-05-21 00:00:00 * @model GLM-5.1 */
<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:inset-auto lg:z-auto lg:translate-x-0 dark:border-gray-700 dark:bg-gray-800',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Ham Admin Console</h1>
      </div>

      <nav class="mt-6 px-3">
        <UVerticalNavigation :links="navLinks" />
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
            color="gray"
            class="lg:hidden"
            @click="sidebarOpen = !sidebarOpen"
          />
        </div>

        <div class="flex items-center gap-3">
          <UTooltip :text="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <UButton
              :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              variant="ghost"
              color="gray"
              @click="toggleColorMode"
            />
          </UTooltip>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const sidebarOpen = ref(false)

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (val: boolean) => (colorMode.preference = val ? 'dark' : 'light'),
})

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const navLinks = [
  { label: 'Dashboard', icon: 'i-heroicons-home', to: '/' },
  { label: 'App Versions', icon: 'i-heroicons-cube', to: '/versions' },
  { label: 'Open Applications', icon: 'i-heroicons-key', to: '/open-apps' },
  { label: 'Settings', icon: 'i-heroicons-cog-6-tooth', to: '/settings' },
]

const route = useRoute()
watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
  },
)
</script>
