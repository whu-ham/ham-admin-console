/**
 * @datetime 2026-05-21 00:00:00
 * @model GLM-5.1
 */
import type { ApiResponse } from '~/types'

export const useApi = () => {
  const toast = useToast()
  const settings = useSettings()

  const request = async <T>(
    method: string,
    path: string,
    options?: { params?: Record<string, string | number | undefined>; body?: unknown },
  ): Promise<T> => {
    const baseApi = settings.getBaseApi()
    if (!baseApi) {
      toast.add({
        title: 'Error',
        description: 'API endpoint not configured. Please configure it in Settings.',
        color: 'red',
      })
      throw new Error('API endpoint not configured')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const authToken = settings.getAuthToken()
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const url = `${baseApi}${path}`

    try {
      const res = await $fetch<ApiResponse<T>>(url, {
        method,
        headers,
        params: options?.params,
        body: options?.body,
      })
      return res.data
    } catch (error: unknown) {
      const err = error as { statusCode?: number; data?: { message?: string }; message?: string }
      const statusCode = err?.statusCode
      const message = err?.data?.message || err?.message || 'Request failed'

      if (statusCode === 403) {
        toast.add({ title: 'Forbidden', description: 'Invalid request type', color: 'red' })
      } else if (statusCode === 404) {
        toast.add({ title: 'Not Found', description: message, color: 'orange' })
      } else {
        toast.add({ title: 'Error', description: message, color: 'red' })
      }
      throw error
    }
  }

  const get = <T>(path: string, params?: Record<string, string | number | undefined>) => {
    return request<T>('GET', path, { params })
  }

  const post = <T>(path: string, body?: unknown) => {
    return request<T>('POST', path, { body })
  }

  const put = <T>(path: string, body?: unknown) => {
    return request<T>('PUT', path, { body })
  }

  const del = <T>(path: string) => {
    return request<T>('DELETE', path)
  }

  return { get, post, put, del }
}
