/**
 * @datetime 2026-05-21 00:00:00
 * @model GLM-5.1
 */

const STORAGE_KEY_BASE_API = 'ham_base_api'
const STORAGE_KEY_AUTH_TOKEN = 'ham_auth_token'

export const useSettings = () => {
  const getBaseApi = (): string => {
    if (import.meta.client) {
      return localStorage.getItem(STORAGE_KEY_BASE_API) || ''
    }
    return ''
  }

  const getAuthToken = (): string => {
    if (import.meta.client) {
      return localStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || ''
    }
    return ''
  }

  const setBaseApi = (url: string) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY_BASE_API, url)
    }
  }

  const setAuthToken = (token: string) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token)
    }
  }

  const isConfigured = (): boolean => {
    return !!getBaseApi()
  }

  return { getBaseApi, getAuthToken, setBaseApi, setAuthToken, isConfigured }
}
