<!-- @datetime 2026-05-21 00:00:00 @model GLM-5.1 -->
<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Open Applications</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage third-party open applications and credentials
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        label="Create Application"
        color="success"
        @click="openCreateModal"
      />
    </div>

    <!-- Table -->
    <UCard>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead
            class="border-b border-gray-200 text-xs text-gray-500 uppercase dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">App ID</th>
              <th class="px-4 py-3">Description</th>
              <th class="px-4 py-3">Redirect URIs</th>
              <th class="px-4 py-3">Created</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in openAppStore.items"
              :key="item.id"
              class="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
            >
              <td class="px-4 py-3 font-mono text-xs text-gray-900 dark:text-white">
                {{ item.id }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <img v-if="item.iconUrl" :src="item.iconUrl" alt="" class="size-6 rounded" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ item.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">
                {{ item.appId }}
              </td>
              <td class="max-w-[200px] px-4 py-3">
                <div v-if="item.description">
                  <p class="truncate text-gray-600 dark:text-gray-300">{{ item.description }}</p>
                  <button
                    class="mt-1 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    @click="openDetailModal(item, 'description')"
                  >
                    View full
                  </button>
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="max-w-[200px] px-4 py-3">
                <div v-if="item.redirectUris?.length">
                  <span class="truncate font-mono text-xs text-gray-500 dark:text-gray-400">{{
                    item.redirectUris[0]
                  }}</span>
                  <button
                    class="mt-1 block text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    @click="openDetailModal(item, 'redirectUris')"
                  >
                    {{
                      item.redirectUris.length > 1
                        ? `View all (${item.redirectUris.length})`
                        : 'View full'
                    }}
                  </button>
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {{ item.createTime ? formatDate(item.createTime) : '-' }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <UTooltip text="View Secret">
                    <UButton
                      icon="i-heroicons-eye"
                      variant="ghost"
                      color="neutral"
                      size="xs"
                      @click="viewSecret(item)"
                    />
                  </UTooltip>
                  <UTooltip text="Reset Secret">
                    <UButton
                      icon="i-heroicons-arrow-path"
                      variant="ghost"
                      color="warning"
                      size="xs"
                      @click="confirmResetSecret(item)"
                    />
                  </UTooltip>
                  <UTooltip text="Edit">
                    <UButton
                      icon="i-heroicons-pencil-square"
                      variant="ghost"
                      color="neutral"
                      size="xs"
                      @click="openEditModal(item)"
                    />
                  </UTooltip>
                  <UTooltip text="Delete">
                    <UButton
                      icon="i-heroicons-trash"
                      variant="ghost"
                      color="error"
                      size="xs"
                      @click="confirmDelete(item)"
                    />
                  </UTooltip>
                </div>
              </td>
            </tr>
            <tr v-if="openAppStore.pending">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Loading...
              </td>
            </tr>
            <tr v-else-if="openAppStore.items.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No open applications found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">Total: {{ openAppStore.total }}</p>
          <UPagination
            v-model:page="currentPage"
            :total="openAppStore.total"
            :items-per-page="pageSize"
          />
        </div>
      </template>
    </UCard>

    <!-- Create/Edit Modal -->
    <UModal v-model:open="modalOpen" :title="isEditing ? 'Edit Application' : 'Create Application'">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Name" name="name" required>
            <UInput v-model="form.name" placeholder="e.g. My SSO App" />
          </UFormField>

          <UFormField label="Icon URL" name="iconUrl">
            <UInput v-model="form.iconUrl" placeholder="https://example.com/icon.png" />
          </UFormField>

          <UFormField label="Description" name="description">
            <UTextarea
              v-model="form.description"
              placeholder="A third-party application"
              :rows="2"
            />
          </UFormField>

          <UFormField label="Redirect URIs" name="redirectUris" :required="!isEditing">
            <div class="space-y-2">
              <div v-for="(_, i) in form.redirectUris" :key="i" class="flex gap-2">
                <UInput
                  v-model="form.redirectUris[i]"
                  placeholder="https://myapp.example.com/callback"
                  class="flex-1"
                />
                <UButton
                  v-if="form.redirectUris.length > 1"
                  icon="i-heroicons-x-mark"
                  variant="ghost"
                  color="error"
                  size="sm"
                  @click="form.redirectUris.splice(i, 1)"
                />
              </div>
              <UButton
                icon="i-heroicons-plus"
                variant="ghost"
                color="neutral"
                size="sm"
                label="Add URI"
                @click="form.redirectUris.push('')"
              />
            </div>
          </UFormField>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton variant="ghost" color="neutral" @click="modalOpen = false">Cancel</UButton>
          <UButton
            :color="isEditing ? 'primary' : 'success'"
            :loading="submitting"
            @click="onSubmit"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Secret Display Modal -->
    <UModal v-model:open="secretModalOpen" title="Application Credentials">
      <template #body>
        <div class="space-y-3">
          <UFormField label="App ID">
            <UInput :model-value="secretData.appId" readonly>
              <template #trailing>
                <UButton
                  icon="i-heroicons-clipboard"
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  @click="copyToClipboard(secretData.appId)"
                />
              </template>
            </UInput>
          </UFormField>
          <UFormField label="App Secret">
            <UInput :model-value="secretData.appSecret" readonly type="password">
              <template #trailing>
                <UButton
                  icon="i-heroicons-clipboard"
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  @click="copyToClipboard(secretData.appSecret)"
                />
              </template>
            </UInput>
          </UFormField>
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            color="warning"
            variant="subtle"
            title="Keep this secret safe!"
            description="Never expose the app secret in client-side code or public repositories."
          />
        </div>
      </template>
      <template #footer>
        <UButton @click="secretModalOpen = false">Close</UButton>
      </template>
    </UModal>

    <!-- Reset Secret Confirmation Modal -->
    <UModal v-model:open="resetSecretModalOpen" title="Reset Application Secret">
      <template #body>
        <p class="text-gray-600 dark:text-gray-300">
          Are you sure you want to reset the secret for <strong>{{ resetTarget?.name }}</strong
          >? The old secret will be immediately invalidated.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton variant="ghost" color="neutral" @click="resetSecretModalOpen = false"
            >Cancel</UButton
          >
          <UButton color="warning" :loading="resetting" @click="onResetSecret"
            >Reset Secret</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModalOpen" title="Confirm Delete">
      <template #body>
        <p class="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete application <strong>{{ deleteTarget?.name }}</strong
          >? This action cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton variant="ghost" color="neutral" @click="deleteModalOpen = false">Cancel</UButton>
          <UButton color="error" :loading="deleting" @click="onDelete">Delete</UButton>
        </div>
      </template>
    </UModal>

    <!-- Detail Modal -->
    <UModal v-model:open="detailModalOpen" :title="detailModalTitle">
      <template #body>
        <div
          v-if="detailModalType === 'description'"
          class="whitespace-pre-wrap text-gray-600 dark:text-gray-300"
        >
          {{ detailModalItem?.description }}
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(uri, i) in detailModalItem?.redirectUris"
            :key="i"
            class="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-800"
          >
            <span class="font-mono text-sm break-all text-gray-700 dark:text-gray-300">{{
              uri
            }}</span>
            <UButton
              icon="i-heroicons-clipboard"
              variant="ghost"
              color="neutral"
              size="xs"
              class="shrink-0"
              @click="copyToClipboard(uri)"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <UButton @click="detailModalOpen = false">Close</UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { OpenAppListItem, CreateOpenAppReq, UpdateOpenAppReq } from '~/types'

const openAppStore = useOpenAppsStore()
const toast = useToast()

const currentPage = ref(1)
const pageSize = ref(20)
const modalOpen = ref(false)
const secretModalOpen = ref(false)
const resetSecretModalOpen = ref(false)
const deleteModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const submitting = ref(false)
const resetting = ref(false)
const deleting = ref(false)
const resetTarget = ref<OpenAppListItem | null>(null)
const deleteTarget = ref<OpenAppListItem | null>(null)

const detailModalOpen = ref(false)
const detailModalType = ref<'description' | 'redirectUris'>('description')
const detailModalItem = ref<OpenAppListItem | null>(null)
const detailModalTitle = computed(() => {
  if (detailModalType.value === 'description') return 'Description'
  return 'Redirect URIs'
})

const openDetailModal = (item: OpenAppListItem, type: 'description' | 'redirectUris') => {
  detailModalItem.value = item
  detailModalType.value = type
  detailModalOpen.value = true
}

const secretData = reactive({
  appId: '',
  appSecret: '',
})

const form = reactive<CreateOpenAppReq & { description: string; iconUrl: string }>({
  name: '',
  iconUrl: '',
  description: '',
  redirectUris: [''],
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

const fetchOpenApps = () => {
  openAppStore.fetchList({ page: currentPage.value, pageSize: pageSize.value })
}

watch(currentPage, () => fetchOpenApps())

onMounted(() => fetchOpenApps())

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  Object.assign(form, { name: '', iconUrl: '', description: '', redirectUris: [''] })
  modalOpen.value = true
}

const openEditModal = (item: OpenAppListItem) => {
  isEditing.value = true
  editingId.value = item.id
  Object.assign(form, {
    name: item.name,
    iconUrl: item.iconUrl || '',
    description: item.description || '',
    redirectUris: item.redirectUris?.length ? [...item.redirectUris] : [''],
  })
  modalOpen.value = true
}

const viewSecret = async (item: OpenAppListItem) => {
  try {
    const detail = await openAppStore.fetchOne(item.id)
    secretData.appId = detail.appId
    secretData.appSecret = detail.appSecret || ''
    secretModalOpen.value = true
  } catch {
    // Error handled by useApi
  }
}

const onSubmit = async () => {
  if (!form.name) {
    toast.add({ title: 'Name is required', color: 'error' })
    return
  }
  if (!isEditing.value && form.redirectUris.filter((u) => u.trim()).length === 0) {
    toast.add({ title: 'At least one redirect URI is required', color: 'error' })
    return
  }

  submitting.value = true
  try {
    if (isEditing.value && editingId.value) {
      const data: UpdateOpenAppReq = {
        name: form.name,
        iconUrl: form.iconUrl || undefined,
        description: form.description || undefined,
        redirectUris: form.redirectUris.filter((u) => u.trim()),
      }
      await openAppStore.update(editingId.value, data)
      toast.add({ title: 'Application updated', color: 'success' })
    } else {
      const data: CreateOpenAppReq = {
        name: form.name,
        iconUrl: form.iconUrl || undefined,
        description: form.description || undefined,
        redirectUris: form.redirectUris.filter((u) => u.trim()),
      }
      const result = await openAppStore.create(data)
      toast.add({ title: 'Application created', color: 'success' })
      // Show credentials after creation
      if (result) {
        secretData.appId = result.appId
        secretData.appSecret = result.appSecret || ''
        secretModalOpen.value = true
      }
    }
    modalOpen.value = false
    fetchOpenApps()
  } catch {
    // Error handled by useApi
  } finally {
    submitting.value = false
  }
}

const confirmResetSecret = (item: OpenAppListItem) => {
  resetTarget.value = item
  resetSecretModalOpen.value = true
}

const onResetSecret = async () => {
  if (!resetTarget.value) return
  resetting.value = true
  try {
    const result = await openAppStore.resetSecret(resetTarget.value.id)
    toast.add({ title: 'Secret reset successfully', color: 'success' })
    resetSecretModalOpen.value = false
    secretData.appId = resetTarget.value.appId
    secretData.appSecret = result.appSecret
    secretModalOpen.value = true
  } catch {
    // Error handled by useApi
  } finally {
    resetting.value = false
  }
}

const confirmDelete = (item: OpenAppListItem) => {
  deleteTarget.value = item
  deleteModalOpen.value = true
}

const onDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await openAppStore.remove(deleteTarget.value.id)
    toast.add({ title: 'Application deleted', color: 'success' })
    deleteModalOpen.value = false
    fetchOpenApps()
  } catch {
    // Error handled by useApi
  } finally {
    deleting.value = false
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: 'Copied to clipboard', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to copy', color: 'error' })
  }
}
</script>
