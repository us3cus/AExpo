<script setup lang="ts">
import { usePostsStore } from '@/stores/posts'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const toast = useToast()
const postsStore = usePostsStore()

const form = ref({
  content: ''
})

const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    await postsStore.createPost(form.value.content)
    toast.add({
      title: 'Пост создан',
      description: 'Ваш пост успешно создан',
      color: 'success'
    })
    router.push('/')
  } catch (error: any) {
    toast.add({
      title: 'Ошибка',
      description: error.message,
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <UFormGroup label="Содержимое поста">
        <UTextarea v-model="form.content" placeholder="Что у вас нового?" required />
      </UFormGroup>
      <UButton type="submit" color="primary" :loading="isLoading" :disabled="isLoading">Создать пост</UButton>
    </form>
  </div>
</template>

