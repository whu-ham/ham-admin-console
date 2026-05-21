/** * @datetime 2026-05-21 00:00:00 * @model GLM-5.1 */
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
        color="green"
        @click="openCreateModal"
      />
    </div>

    <!-- Table -->
    <UCard>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead
            class="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700 dark:text-gray-400"
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
              v-for="item in openAppStore.items.value"
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
              <td
                class="max-w-[200px] truncate px-4 py-3 text-gray-600 dark:text-gray-300"
                :title="item.description"
              >
                {{ item.description || '-' }}
              </td>
              <td class="max-w-[200px] px-4 py-3">
                <div v-if="item.redirectUris?.length" class="flex flex-col gap-1">
                  <span
                    v-for="(uri, i) in item.redirectUris.slice(0, 2)"
                    :key="i"
                    class="truncate font-mono text-xs text-gray-500 dark:text-gray-400"
                    :title="uri"
                    >{{ uri }}</span
                  >
                  <span v-if="item.redirectUris.length > 2" class="text-xs text-gray-400">
                    +{{ item.redirectUris.length - 2 }} more
                  </span>
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                {{ item.createTime ? formatDate(item.createTime) : '-' }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <UTooltip text="View Secret">
                    <UButton
                      icon="i-heroicons-eye"
                      variant="ghost"
                      color="gray"
                      size="xs"
                      @click="viewSecret(item)"
                    />
                  </UTooltip>
                  <UTooltip text="Reset Secret">
                    <UButton
                      icon="i-heroicons-arrow-path"
                      variant="ghost"
                      color="orange"
                      size="xs"
                      @click="confirmResetSecret(item)"
                    />
                  </UTooltip>
                  <UTooltip text="Edit">
                    <UButton
                      icon="i-heroicons-pencil-square"
                      variant="ghost"
                      color="gray"
                      size="xs"
                      @click="openEditModal(item)"
                    />
                  </UTooltip>
                  <UTooltip text="Delete">
                    <UButton
                      icon="i-heroicons-trash"
                      variant="ghost"
                      color="red"
                      size="xs"
                      @click="confirmDelete(item)"
                    />
                  </UTooltip>
                </div>
              </td>
            </tr>
            <tr v-if="openAppStore.pending.value">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Loading...
              </td>
            </tr>
            <tr v-else-if="openAppStore.items.value.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No open applications found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Total: {{ openAppStore.total.value }}
          </p>
          <UPagination
            v-model="currentPage"
            :total="openAppStore.total.value"
            :page-size="pageSize"
            :max="5"
          />
        </div>
      </template>
    </UCard>

    <!-- Create/Edit Modal -->
    <UModal v-model="modalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Application' : 'Create Application' }}
          </h3>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Name" name="name" required>
            <UInput v-model="form.name" placeholder="e.g. My SSO App" />
          </UFormGroup>

          <UFormGroup label="Icon URL" name="iconUrl">
            <UInput v-model="form.iconUrl" placeholder="https://example.com/icon.png" />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea
              v-model="form.description"
              placeholder="A third-party application"
              :rows="2"
            />
          </UFormGroup>

          <UFormGroup label="Redirect URIs" name="redirectUris" :required="!isEditing">
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
                  color="red"
                  size="sm"
                  @click="form.redirectUris.splice(i, 1)"
                />
              </div>
              <UButton
                icon="i-heroicons-plus"
                variant="ghost"
                color="gray"
                size="sm"
                label="Add URI"
                @click="form.redirectUris.push('')"
              />
            </div>
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" color="gray" @click="modalOpen = false">Cancel</UButton>
            <UButton
              :color="isEditing ? 'primary' : 'green'"
              :loading="submitting"
              @click="onSubmit"
            >
              {{ isEditing ? 'Update' : 'Create' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Secret Display Modal -->
    <UModal v-model="secretModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Application Credentials
          </h3>
        </template>
        <div class="space-y-3">
          <UFormGroup label="App ID">
            <UInput :model-value="secretData.appId" readonly>
              <template #trailing>
                <UButton
                  icon="i-heroicons-clipboard"
                  variant="ghost"
                  color="gray"
                  size="xs"
                  @click="copyToClipboard(secretData.appId)"
                />
              </template>
            </UInput>
          </UFormGroup>
          <UFormGroup label="App Secret">
            <UInput :model-value="secretData.appSecret" readonly type="password">
              <template #trailing>
                <UButton
                  icon="i-heroicons-clipboard"
                  variant="ghost"
                  color="gray"
                  size="xs"
                  @click="copyToClipboard(secretData.appSecret)"
                />
              </template>
            </UInput>
          </UFormGroup>
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            color="orange"
            variant="subtle"
            title="Keep this secret safe!"
            description="Never expose the app secret in client-side code or public repositories."
          />
        </div>
        <template #footer>
          <UButton @click="secretModalOpen = false">Close</UButton>
        </template>
      </UCard>
    </UModal>

    <!-- Reset Secret Confirmation Modal -->
    <UModal v-model="resetSecretModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Reset Application Secret
          </h3>
        </template>
        <p class="text-gray-600 dark:text-gray-300">
          Are you sure you want to reset the secret for <strong>{{ resetTarget?.name }}</strong
          >? The old secret will be immediately invalidated.
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" color="gray" @click="resetSecretModalOpen = false"
              >Cancel</UButton
            >
            <UButton color="orange" :loading="resetting" @click="onResetSecret"
              >Reset Secret</UButton
            >
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="deleteModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Confirm Delete</h3>
        </template>
        <p class="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete application <strong>{{ deleteTarget?.name }}</strong
          >? This action cannot be undone.
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" color="gray" @click="deleteModalOpen = false">Cancel</UButton>
            <UButton color="red" :loading="deleting" @click="onDelete">Delete</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { OpenAppListItem, CreateOpenAppReq, UpdateOpenAppReq } from '~/types'

const openAppStore = useOpenApps()
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
    toast.add({ title: 'Name is required', color: 'red' })
    return
  }
  if (!isEditing.value && form.redirectUris.filter((u) => u.trim()).length === 0) {
    toast.add({ title: 'At least one redirect URI is required', color: 'red' })
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
      toast.add({ title: 'Application updated', color: 'green' })
    } else {
      const data: CreateOpenAppReq = {
        name: form.name,
        iconUrl: form.iconUrl || undefined,
        description: form.description || undefined,
        redirectUris: form.redirectUris.filter((u) => u.trim()),
      }
      const result = await openAppStore.create(data)
      toast.add({ title: 'Application created', color: 'green' })
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
    toast.add({ title: 'Secret reset successfully', color: 'green' })
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
    toast.add({ title: 'Application deleted', color: 'green' })
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
    toast.add({ title: 'Copied to clipboard', color: 'green' })
  } catch {
    toast.add({ title: 'Failed to copy', color: 'red' })
  }
}
</script>
