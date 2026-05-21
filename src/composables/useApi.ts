/**
 * @datetime 2026-05-21 00:00:00
 * @model GLM-5.1
 */
import type { ApiResponse } from '~/types'

export const useApi = () => {
  const settingsStore = useSettingsStore()

  const request = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    options?: {
      params?: Record<string, string | number | undefined>
      body?: Record<string, unknown>
    },
  ): Promise<T> => {
    if (!settingsStore.baseApi) {
      return undefined as T
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (settingsStore.authToken) {
      headers['Authorization'] = `Bearer ${settingsStore.authToken}`
    }

    try {
      const res = await $fetch<ApiResponse<T>>(`${settingsStore.baseApi}${path}`, {
        method,
        headers,
        params: options?.params as Record<string, string>,
        body: options?.body,
      })
      return res.data as T
    } catch (error: unknown) {
      const toast = useToast()
      const err = error as { statusCode?: number; data?: { message?: string }; message?: string }
      const message = err?.data?.message || err?.message || 'An error occurred'
      toast.add({ title: `Error: ${message}`, color: 'error' })
      throw error
    }
  }

  const get = <T>(path: string, params?: Record<string, string | number | undefined>) => {
    return request<T>('GET', path, { params })
  }

  const post = <T>(path: string, body?: unknown) => {
    return request<T>('POST', path, { body: body as Record<string, unknown> })
  }

  const put = <T>(path: string, body?: unknown) => {
    return request<T>('PUT', path, { body: body as Record<string, unknown> })
  }

  const del = <T>(path: string) => {
    return request<T>('DELETE', path)
  }

  return { get, post, put, del }
}
