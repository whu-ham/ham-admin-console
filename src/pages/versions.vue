/** * @datetime 2026-05-21 00:00:00 * @model GLM-5.1 */
<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">App Versions</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage mobile app version releases
        </p>
      </div>
      <UButton icon="i-heroicons-plus" label="Create Version" @click="openCreateModal" />
    </div>

    <!-- Filters -->
    <div class="mb-4 flex flex-wrap gap-3">
      <USelect
        v-model="filters.platform"
        :options="platformOptions"
        placeholder="All Platforms"
        class="w-40"
        @change="onFilterChange"
      />
      <USelect
        v-model="filters.channel"
        :options="channelOptions"
        placeholder="All Channels"
        class="w-40"
        @change="onFilterChange"
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
              <th class="px-4 py-3">Platform</th>
              <th class="px-4 py-3">Channel</th>
              <th class="px-4 py-3">Version</th>
              <th class="px-4 py-3">Code</th>
              <th class="px-4 py-3">Changelog</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Updated</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in versionStore.items.value"
              :key="item.id"
              class="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
            >
              <td class="px-4 py-3 font-mono text-gray-900 dark:text-white">{{ item.id }}</td>
              <td class="px-4 py-3">
                <UBadge
                  :label="item.platform"
                  :color="item.platform === 'android' ? 'green' : 'blue'"
                  variant="subtle"
                  size="xs"
                />
              </td>
              <td class="px-4 py-3">
                <UBadge
                  :label="item.channel"
                  :color="item.channel === 'release' ? 'green' : 'orange'"
                  variant="subtle"
                  size="xs"
                />
              </td>
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                {{ item.versionName }}
              </td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ item.versionCode }}</td>
              <td
                class="max-w-[200px] truncate px-4 py-3 text-gray-600 dark:text-gray-300"
                :title="item.changeLog"
              >
                {{ item.changeLogTitle || item.changeLog || '-' }}
              </td>
              <td class="px-4 py-3">
                <UBadge
                  :label="item.enabled ? 'Enabled' : 'Disabled'"
                  :color="item.enabled ? 'green' : 'red'"
                  variant="subtle"
                  size="xs"
                />
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                {{ item.updateTime ? formatDate(item.updateTime) : '-' }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
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
            <tr v-if="versionStore.pending.value">
              <td colspan="9" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Loading...
              </td>
            </tr>
            <tr v-else-if="versionStore.items.value.length === 0">
              <td colspan="9" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No versions found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Total: {{ versionStore.total.value }}
          </p>
          <UPagination
            v-model="currentPage"
            :total="versionStore.total.value"
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
            {{ isEditing ? 'Edit Version' : 'Create Version' }}
          </h3>
        </template>

        <UForm :state="form" @submit="onSubmit">
          <div class="space-y-4">
            <UFormGroup label="Platform" name="platform" required>
              <USelect
                v-model="form.platform"
                :options="platformRequiredOptions"
                placeholder="Select platform"
              />
            </UFormGroup>

            <UFormGroup label="Channel" name="channel" required>
              <USelect
                v-model="form.channel"
                :options="channelRequiredOptions"
                placeholder="Select channel"
              />
            </UFormGroup>

            <UFormGroup label="Version Name" name="versionName" required>
              <UInput v-model="form.versionName" placeholder="e.g. 2.1.0" />
            </UFormGroup>

            <UFormGroup label="Version Code" name="versionCode" required>
              <UInput v-model.number="form.versionCode" type="number" placeholder="e.g. 30" />
            </UFormGroup>

            <UFormGroup label="Changelog Title" name="changeLogTitle">
              <UInput v-model="form.changeLogTitle" placeholder="e.g. New Features" />
            </UFormGroup>

            <UFormGroup label="Changelog" name="changeLog">
              <UTextarea
                v-model="form.changeLog"
                placeholder="- Added dark mode&#10;- Fixed login crash"
                :rows="3"
              />
            </UFormGroup>

            <UFormGroup label="Update URL" name="updateUrl">
              <UInput v-model="form.updateUrl" placeholder="https://example.com/app-2.1.0.apk" />
            </UFormGroup>

            <UFormGroup label="Enabled" name="enabled">
              <UToggle v-model="form.enabled" />
            </UFormGroup>
          </div>
        </UForm>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" color="gray" @click="modalOpen = false">Cancel</UButton>
            <UButton :loading="submitting" @click="onSubmit">{{
              isEditing ? 'Update' : 'Create'
            }}</UButton>
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
          Are you sure you want to delete version
          <strong>{{ deleteTarget?.versionName }}</strong> (ID: {{ deleteTarget?.id }})? This action
          cannot be undone.
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
import type { AppVersion, CreateVersionReq, Platform, Channel, UpdateVersionReq } from '~/types'

const versionStore = useVersions()
const toast = useToast()

const currentPage = ref(1)
const pageSize = ref(20)
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const deleting = ref(false)
const deleteTarget = ref<AppVersion | null>(null)

const filters = reactive({
  platform: '' as Platform | '',
  channel: '' as Channel | '',
})

const platformOptions = [
  { label: 'All Platforms', value: '' },
  { label: 'Android', value: 'android' },
  { label: 'iOS', value: 'ios' },
]

const channelOptions = [
  { label: 'All Channels', value: '' },
  { label: 'Beta', value: 'beta' },
  { label: 'Release', value: 'release' },
]

const platformRequiredOptions = [
  { label: 'Android', value: 'android' },
  { label: 'iOS', value: 'ios' },
]

const channelRequiredOptions = [
  { label: 'Beta', value: 'beta' },
  { label: 'Release', value: 'release' },
]

const form = reactive<CreateVersionReq & { enabled: boolean }>({
  platform: 'android',
  channel: 'release',
  versionCode: 1,
  versionName: '',
  changeLogTitle: '',
  changeLog: '',
  updateUrl: '',
  enabled: true,
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

const onFilterChange = () => {
  currentPage.value = 1
  fetchVersions()
}

const fetchVersions = () => {
  versionStore.fetchList({
    page: currentPage.value,
    pageSize: pageSize.value,
    platform: filters.platform || undefined,
    channel: filters.channel || undefined,
  })
}

watch(currentPage, () => fetchVersions())

onMounted(() => fetchVersions())

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  Object.assign(form, {
    platform: 'android',
    channel: 'release',
    versionCode: 1,
    versionName: '',
    changeLogTitle: '',
    changeLog: '',
    updateUrl: '',
    enabled: true,
  })
  modalOpen.value = true
}

const openEditModal = (item: AppVersion) => {
  isEditing.value = true
  editingId.value = item.id
  Object.assign(form, {
    platform: item.platform,
    channel: item.channel,
    versionCode: item.versionCode,
    versionName: item.versionName,
    changeLogTitle: item.changeLogTitle || '',
    changeLog: item.changeLog || '',
    updateUrl: item.updateUrl || '',
    enabled: item.enabled,
  })
  modalOpen.value = true
}

const onSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value && editingId.value) {
      const data: UpdateVersionReq = { ...form }
      await versionStore.update(editingId.value, data)
      toast.add({ title: 'Version updated', color: 'green' })
    } else {
      await versionStore.create(form)
      toast.add({ title: 'Version created', color: 'green' })
    }
    modalOpen.value = false
    fetchVersions()
  } catch {
    // Error handled by useApi
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (item: AppVersion) => {
  deleteTarget.value = item
  deleteModalOpen.value = true
}

const onDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await versionStore.remove(deleteTarget.value.id)
    toast.add({ title: 'Version deleted', color: 'green' })
    deleteModalOpen.value = false
    fetchVersions()
  } catch {
    // Error handled by useApi
  } finally {
    deleting.value = false
  }
}
</script>
