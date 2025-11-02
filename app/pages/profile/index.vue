<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="!user" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-primary" />
      </div>

      <!-- Profile Content -->
      <div v-else>
        <!-- Profile Header -->
        <UCard class="mb-6">
          <div class="flex items-start gap-6">
            <UAvatar
              v-if="user.avatarUrl"
              :src="user.avatarUrl"
              size="xl"
              :alt="`${user.firstName} ${user.lastName}`"
            />
            <UAvatar
              v-else
              size="xl"
              :text="user.firstName.charAt(0)"
            />
            
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {{ user.firstName }} {{ user.lastName }}
              </h1>
              <p class="text-gray-500 dark:text-gray-400 mb-4">
                {{ user.email }}
              </p>
              
              <div class="flex gap-2">
                <UButton
                  color="primary"
                  icon="i-heroicons-pencil-square"
                  to="/settings"
                >
                  Редактировать профиль
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!-- User's Posts -->
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Мои посты
          </h2>
        </div>
        
        <div v-if="userPosts.length === 0" class="text-center py-12">
          <UCard>
            <UIcon name="i-heroicons-document-text" class="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Нет постов
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">
              Вы еще не создали ни одного поста
            </p>
            <UButton color="primary" to="/posts/create">
              Создать пост
            </UButton>
          </UCard>
        </div>

        <div v-else class="space-y-4">
          <PostCard
            v-for="post in userPosts"
            :key="post.id"
            :post="post"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { usePostsStore } from '@/stores/posts'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { user } = useAuth()
const postsStore = usePostsStore()

const userPosts = computed(() => {
  return postsStore.posts.filter(post => post.userId === user.value?.id)
})

onMounted(async () => {
  if (postsStore.posts.length === 0) {
    await postsStore.fetchPosts()
  }
})
</script>
