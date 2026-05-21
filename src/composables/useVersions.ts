/**
 * @datetime 2026-05-21 00:00:00
 * @model GLM-5.1
 */
import type {
  AppVersion,
  CreateVersionReq,
  ListVersionsParams,
  PaginatedData,
  UpdateVersionReq,
} from '~/types'

export const useVersions = () => {
  const api = useApi()

  const items = ref<AppVersion[]>([])
  const total = ref(0)
  const pending = ref(false)

  const fetchList = async (params?: ListVersionsParams) => {
    pending.value = true
    try {
      const data = await api.get<PaginatedData<AppVersion>>('/api/versions', {
        page: params?.page,
        pageSize: params?.pageSize,
        platform: params?.platform,
        channel: params?.channel,
      })
      items.value = data.items
      total.value = data.total
    } finally {
      pending.value = false
    }
  }

  const fetchOne = async (id: number) => {
    return api.get<AppVersion>(`/api/versions/${id}`)
  }

  const create = async (data: CreateVersionReq) => {
    return api.post<AppVersion>('/api/versions', data)
  }

  const update = async (id: number, data: UpdateVersionReq) => {
    return api.put<AppVersion>(`/api/versions/${id}`, data)
  }

  const remove = async (id: number) => {
    return api.del<null>(`/api/versions/${id}`)
  }

  return { items, total, pending, fetchList, fetchOne, create, update, remove }
}
