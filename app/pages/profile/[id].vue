<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-primary" />
      </div>

      <!-- Error State -->
      <UCard v-else-if="!profileUser" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-circle" class="mx-auto text-6xl text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Пользователь не найден
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          К сожалению, этот профиль недоступен
        </p>
        <UButton color="primary" to="/">
          На главную
        </UButton>
      </UCard>

      <!-- Profile Content -->
      <div v-else>
        <!-- Profile Header -->
        <UCard class="mb-6">
          <div class="flex items-start gap-6">
            <UAvatar
              v-if="profileUser.avatarUrl"
              :src="profileUser.avatarUrl"
              size="xl"
              :alt="`${profileUser.firstName} ${profileUser.lastName}`"
            />
            <UAvatar
              v-else
              size="xl"
              :text="profileUser.firstName.charAt(0)"
            />
            
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {{ profileUser.firstName }} {{ profileUser.lastName }}
              </h1>
              <p class="text-gray-500 dark:text-gray-400 mb-4">
                {{ profileUser.email }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- User's Posts -->
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Посты пользователя
          </h2>
        </div>
        
        <div v-if="userPosts.length === 0" class="text-center py-12">
          <UCard>
            <UIcon name="i-heroicons-document-text" class="mx-auto text-6xl text-gray-400 mb-4" />
            <p class="text-gray-500 dark:text-gray-400">
              Пользователь еще не создал ни одного поста
            </p>
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
import { usePostsStore } from '@/stores/posts'
import type { PostUser } from '@/stores/posts'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const postsStore = usePostsStore()

const isLoading = ref(true)
const profileUser = ref<PostUser | null>(null)

const userPosts = computed(() => {
  const userId = parseInt(route.params.id as string)
  return postsStore.posts.filter(post => post.userId === userId)
})

onMounted(async () => {
  try {
    await postsStore.fetchPosts()
    
    // Find user from posts
    const userId = parseInt(route.params.id as string)
    const userPost = postsStore.posts.find(post => post.userId === userId)
    
    if (userPost) {
      profileUser.value = userPost.user
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
    useToast().add({
      title: 'Ошибка',
      description: 'Не удалось загрузить профиль',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
})
</script>
