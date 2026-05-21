/**
 * @datetime 2026-05-21 00:00:00
 * @model GLM-5.1
 */
import { defineStore } from 'pinia'

const STORAGE_KEY_BASE_API = 'ham_base_api'
const STORAGE_KEY_AUTH_TOKEN = 'ham_auth_token'
const STORAGE_KEY_COLOR_MODE = 'ham_color_mode'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    baseApi: '' as string,
    authToken: '' as string,
    colorModePreference: 'system' as 'light' | 'dark' | 'system',
    loaded: false,
  }),

  getters: {
    isConfigured: (state) => !!state.baseApi,
  },

  actions: {
    loadFromStorage() {
      if (import.meta.client && !this.loaded) {
        this.baseApi = localStorage.getItem(STORAGE_KEY_BASE_API) || ''
        this.authToken = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || ''
        this.colorModePreference =
          (localStorage.getItem(STORAGE_KEY_COLOR_MODE) as 'light' | 'dark' | 'system') || 'system'
        this.loaded = true
      }
    },

    setBaseApi(url: string) {
      this.baseApi = url
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY_BASE_API, url)
      }
    },

    setAuthToken(token: string) {
      this.authToken = token
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token)
      }
    },

    clearAuthToken() {
      this.authToken = ''
      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN)
      }
    },

    setColorModePreference(preference: 'light' | 'dark' | 'system') {
      this.colorModePreference = preference
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY_COLOR_MODE, preference)
      }
    },
  },
})
