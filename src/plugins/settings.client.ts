export default defineNuxtPlugin(() => {
  const settingsStore = useSettingsStore()
  settingsStore.loadFromStorage()
})
