/**
 * @datetime 2026-05-21 00:00:00
 * @model GLM-5.1
 */
import type {
  CreateOpenAppReq,
  ListParams,
  OpenApp,
  OpenAppListItem,
  PaginatedData,
  ResetSecretResponse,
  UpdateOpenAppReq,
} from '~/types'

export const useOpenApps = () => {
  const api = useApi()

  const items = ref<OpenAppListItem[]>([])
  const total = ref(0)
  const pending = ref(false)

  const fetchList = async (params?: ListParams) => {
    pending.value = true
    try {
      const data = await api.get<PaginatedData<OpenAppListItem>>('/api/open-apps', {
        page: params?.page,
        pageSize: params?.pageSize,
      })
      items.value = data.items
      total.value = data.total
    } finally {
      pending.value = false
    }
  }

  const fetchOne = async (id: string) => {
    return api.get<OpenApp>(`/api/open-apps/${id}`)
  }

  const create = async (data: CreateOpenAppReq) => {
    return api.post<OpenApp>('/api/open-apps', data)
  }

  const update = async (id: string, data: UpdateOpenAppReq) => {
    return api.put<OpenApp>(`/api/open-apps/${id}`, data)
  }

  const remove = async (id: string) => {
    return api.del<null>(`/api/open-apps/${id}`)
  }

  const resetSecret = async (id: string) => {
    return api.put<ResetSecretResponse>(`/api/open-apps/${id}/secret`)
  }

  return {
    items,
    total,
    pending,
    fetchList,
    fetchOne,
    create,
    update,
    remove,
    resetSecret,
  }
}
