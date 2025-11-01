<script setup lang="ts">
interface Post {
  id: number
  content: string
  userId: number
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    firstName: string
    lastName: string
    avatar?: string
  }
}

const props = defineProps<{
  post: Post
}>()

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'только что'
  if (diffMins < 60) return `${diffMins} мин назад`
  if (diffHours < 24) return `${diffHours} ч назад`
  if (diffDays < 7) return `${diffDays} д назад`
  
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

const userInitials = computed(() => {
  if (!props.post.user) return 'U'
  return `${props.post.user.firstName?.charAt(0) || ''}${props.post.user.lastName?.charAt(0) || ''}`
})
</script>

<template>
  <UCard>
    <!-- Post Header -->
    <div class="flex items-start gap-3 mb-4">
      <UAvatar
        v-if="post.user?.avatar"
        :src="post.user.avatar"
        size="md"
        :alt="post.user.firstName"
      />
      <UAvatar
        v-else
        size="md"
        :text="userInitials"
      />
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-gray-900 dark:text-white">
          {{ post.user?.firstName }} {{ post.user?.lastName }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ formatDate(post.createdAt) }}
        </p>
      </div>
      <UDropdown
        :items="[
          [{ label: 'Редактировать', icon: 'i-heroicons-pencil-square' }],
          [{ label: 'Удалить', icon: 'i-heroicons-trash', class: 'text-red-600 dark:text-red-400' }]
        ]"
      >
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
      </UDropdown>
    </div>

    <!-- Post Content -->
    <div class="mb-4">
      <p class="text-gray-900 dark:text-white whitespace-pre-wrap">{{ post.content }}</p>
    </div>

    <!-- Post Actions -->
    <div class="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-heart">
        Нравится
      </UButton>
      <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-chat-bubble-left">
        Комментарии
      </UButton>
      <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-share">
        Поделиться
      </UButton>
    </div>
  </UCard>
</template>
