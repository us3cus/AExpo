<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const form = ref({
  text: '',
  hashtags: '',
  privacy: 'public'
})

const selectedFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const isLoading = ref(false)

const editorRef = ref()
const mediaUploaderRef = ref()

const isFormValid = computed(() => editorRef.value?.isValid)

const handleSubmit = async () => {
  if (!form.value.text.trim()) {
    toast.add({
      title: 'Ошибка',
      description: 'Содержимое поста не может быть пустым',
      color: 'error'
    })
    return
  }

  try {
    isLoading.value = true

    const formData = new FormData()
    formData.append('text', form.value.text)
    formData.append('privacy', form.value.privacy)

    if (form.value.hashtags.trim()) {
      const hashtags = form.value.hashtags
        .split(/[,\s#]+/)
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      hashtags.forEach(tag => {
        formData.append('hashtags', tag)
      })
    }

    selectedFiles.value.forEach(file => {
      formData.append('media', file)
    })

    const token = authStore.token
    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000/api/v1'}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Не удалось создать пост')
    }

    toast.add({
      title: 'Пост опубликован!',
      description: 'Ваш пост успешно создан',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
    router.push('/')
  } catch (error: any) {
    toast.add({
      title: 'Ошибка публикации',
      description: error.message,
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  if (form.value.text.trim() || selectedFiles.value.length > 0) {
    if (confirm('Вы уверены? Несохраненные изменения будут потеряны.')) {
      router.push('/')
    }
  } else {
    router.push('/')
  }
}

const handleUploadMedia = () => {
  mediaUploaderRef.value?.triggerFileInput()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Top Bar -->
    <div class="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-3xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-left"
              size="lg"
              @click="handleCancel"
              :disabled="isLoading"
            />
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Новый пост</h1>
          </div>
          <UButton
            color="primary"
            size="lg"
            :loading="isLoading"
            :disabled="!isFormValid || isLoading"
            @click="handleSubmit"
          >
            Опубликовать
          </UButton>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-3xl mx-auto px-4 py-6">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Post Editor Component -->
        <PostEditor
          ref="editorRef"
          v-model:text="form.text"
          v-model:hashtags="form.hashtags"
        />

        <!-- Media Uploader Component -->
        <PostMediaUploader
          ref="mediaUploaderRef"
          v-model:files="selectedFiles"
          v-model:preview-urls="previewUrls"
          :disabled="isLoading"
          :max-files="10"
        />

        <!-- Action Bar Component -->
        <PostActionBar
          v-model:privacy="form.privacy"
          :disabled="isLoading"
          :files-count="selectedFiles.length"
          :max-files="10"
          @upload-media="handleUploadMedia"
        />
      </form>
    </div>
  </div>
</template>

