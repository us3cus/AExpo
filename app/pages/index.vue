<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4 mb-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">AExpo</h1>
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              size="md"
              variant="outline"
              placeholder="Поиск..."
            />
          </div>
          <UButton
            v-if="user"
            color="primary"
            icon="i-heroicons-plus"
            @click="navigateToCreate"
          >
            Создать пост
          </UButton>
          <NuxtLink to="/users/profile">
            <UAvatar
              v-if="user?.avatarUrl"
              :src="user.avatarUrl"
              size="md"
              :alt="user.firstName"
            />
            <UAvatar
              v-else
              size="md"
              :text="user?.firstName?.charAt(0) || 'U'"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Quick Post Card -->
      <UCard v-if="user" class="mb-6">
        <div class="flex items-start gap-4">
          <button
            @click="navigateToCreate"
            class="flex-1 text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span class="text-gray-500 dark:text-gray-400">Что у вас нового?</span>
          </button>
        </div>
      </UCard>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-primary" />
      </div>

      <!-- Empty State -->
      <UCard v-else-if="!postsStore.posts.length" class="text-center py-12">
        <UIcon name="i-heroicons-document-text" class="mx-auto text-6xl text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Нет постов
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Будьте первым, кто создаст пост!
        </p>
        <UButton v-if="user" color="primary" @click="navigateToCreate">
          Создать первый пост
        </UButton>
      </UCard>

      <!-- Posts Feed -->
      <div v-else class="space-y-4">
        <PostCard
          v-for="post in postsStore.posts"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostsStore } from '@/stores/posts'
import { useAuth } from '@/composables/useAuth'

definePageMeta({
  layout: 'default'
})

const postsStore = usePostsStore()
const { user } = useAuth()
const router = useRouter()

const isLoading = ref(true)
const searchQuery = ref('')

onMounted(async () => {
  try {
    await postsStore.fetchPosts()
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    isLoading.value = false
  }
})

const navigateToCreate = () => {
  router.push('/posts/create')
}
</script>

