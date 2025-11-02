<script setup lang="ts">
interface PostUser {
  id: number
  firstName: string
  lastName: string
  avatarUrl?: string
}

interface Post {
  id: number
  text: string
  hashtags: string[]
  mediaUrl?: string | null
  mediaMimeType?: string | null
  privacy: string
  user: PostUser
  createdAt: string
  updatedAt: string
}

const props = defineProps<{
  post: Post
}>()

const isLiked = ref(false)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Только что'
  if (diffMins < 60) return `${diffMins} мин. назад`
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays < 7) return `${diffDays} дн. назад`
  
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const handleLike = () => {
  isLiked.value = !isLiked.value
  useToast().add({
    title: isLiked.value ? 'Пост добавлен в избранное' : 'Убрано из избранного',
    color: 'success'
  })
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink :to="`/users/${post.user.id}`">
            <UAvatar
              v-if="post.user.avatarUrl"
              :src="post.user.avatarUrl"
              size="md"
              :alt="`${post.user.firstName} ${post.user.lastName}`"
            />
            <UAvatar
              v-else
              size="md"
              :text="post.user.firstName.charAt(0)"
            />
          </NuxtLink>
          <div>
            <NuxtLink :to="`/users/${post.user.id}`">
              <h3 class="font-semibold text-gray-900 dark:text-white hover:text-primary">
                {{ post.user.firstName }} {{ post.user.lastName }}
              </h3>
            </NuxtLink>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(post.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-3">
      <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {{ post.text }}
      </p>
      
      <div v-if="post.hashtags.length > 0" class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.hashtags"
          :key="tag"
          class="text-sm text-primary hover:underline cursor-pointer"
        >
          #{{ tag }}
        </span>
      </div>

      <div v-if="post.mediaUrl" class="mt-4">
        <img
          v-if="post.mediaMimeType?.startsWith('image/')"
          :src="post.mediaUrl"
          alt="Post media"
          class="w-full rounded-lg object-cover max-h-96"
        />
        <video
          v-else-if="post.mediaMimeType?.startsWith('video/')"
          :src="post.mediaUrl"
          controls
          class="w-full rounded-lg max-h-96"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center gap-4 text-gray-500 dark:text-gray-400">
        <button
          class="flex items-center gap-1 hover:text-primary transition-colors"
          @click="handleLike"
        >
          <UIcon
            :name="isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            class="text-xl"
            :class="{ 'text-red-500': isLiked }"
          />
          <span>{{ 0 }}</span>
        </button>
        <button class="flex items-center gap-1 hover:text-primary transition-colors">
          <UIcon name="i-heroicons-chat-bubble-left" class="text-xl" />
          <span>{{ 0 }}</span>
        </button>
        <div class="ml-auto">
          <UBadge
            v-if="post.privacy === 'private'"
            color="gray"
            variant="subtle"
          >
            Приватный
          </UBadge>
        </div>
      </div>
    </template>
  </UCard>
</template>
