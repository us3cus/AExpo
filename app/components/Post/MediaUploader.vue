<script setup lang="ts">
const toast = useToast()

const files = defineModel<File[]>('files', { required: true })
const previewUrls = defineModel<string[]>('previewUrls', { required: true })

interface Props {
  disabled?: boolean
  maxFiles?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  maxFiles: 10
})

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFiles = target.files
  if (!selectedFiles) return

  const newFiles = Array.from(selectedFiles)
  
  if (files.value.length + newFiles.length > props.maxFiles) {
    toast.add({
      title: 'Лимит превышен',
      description: `Можно загрузить максимум ${props.maxFiles} файлов`,
      color: 'orange'
    })
    return
  }

  files.value.push(...newFiles)

  newFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrls.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })

  // Reset input
  if (target) target.value = ''
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

defineExpose({ triggerFileInput })
</script>

<template>
  <UCard v-if="previewUrls.length > 0" :ui="{ body: { padding: 'p-6' } }">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          Медиа файлы ({{ files.length }}/{{ maxFiles }})
        </h3>
        <input
          ref="fileInputRef"
          type="file"
          multiple
          accept="image/*,video/*"
          class="hidden"
          @change="handleFileSelect"
        />
        <UButton
          v-if="files.length < maxFiles"
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-plus"
          @click="triggerFileInput"
          :disabled="disabled"
        >
          Добавить еще
        </UButton>
      </div>

      <!-- Preview Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div
          v-for="(url, index) in previewUrls"
          :key="index"
          class="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
        >
          <img
            :src="url"
            class="w-full h-full object-cover"
            :alt="`Медиа ${index + 1}`"
          />
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <UButton
              color="white"
              variant="solid"
              icon="i-heroicons-trash"
              size="sm"
              @click="removeFile(index)"
            >
              Удалить
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
