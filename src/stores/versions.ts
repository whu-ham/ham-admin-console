/**
 * @datetime 2026-05-21 00:00:00
 * @model GLM-5.1
 */
import { defineStore } from 'pinia'
import type {
  AppVersion,
  CreateVersionReq,
  ListVersionsParams,
  PaginatedData,
  UpdateVersionReq,
} from '~/types'

export const useVersionsStore = defineStore('versions', {
  state: () => ({
    items: [] as AppVersion[],
    total: 0,
    pending: false,
  }),

  actions: {
    async fetchList(params?: ListVersionsParams) {
      const api = useApi()
      this.pending = true
      try {
        const data = await api.get<PaginatedData<AppVersion>>('/api/versions', {
          page: params?.page,
          pageSize: params?.pageSize,
          platform: params?.platform,
          channel: params?.channel,
        })
        this.items = data?.items ?? []
        this.total = data?.total ?? 0
      } finally {
        this.pending = false
      }
    },

    async fetchOne(id: number) {
      const api = useApi()
      return api.get<AppVersion>(`/api/versions/${id}`)
    },

    async create(data: CreateVersionReq) {
      const api = useApi()
      return api.post<AppVersion>('/api/versions', data)
    },

    async update(id: number, data: UpdateVersionReq) {
      const api = useApi()
      return api.put<AppVersion>(`/api/versions/${id}`, data)
    },

    async remove(id: number) {
      const api = useApi()
      return api.del<null>(`/api/versions/${id}`)
    },
  },
})
