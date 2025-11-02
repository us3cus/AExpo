<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

const text = defineModel<string>('text', { required: true })
const hashtags = defineModel<string>('hashtags', { required: true })

const maxChars = 5000
const charCount = computed(() => text.value.length)
const isValid = computed(() => charCount.value > 0 && charCount.value <= maxChars)

defineExpose({ isValid })
</script>

<template>
  <UCard :ui="{ body: { padding: 'p-6' } }">
    <div class="flex gap-4">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <UAvatar
          v-if="user?.avatar"
          :src="user.avatar"
          size="lg"
          :alt="user.firstName"
        />
        <UAvatar
          v-else
          size="lg"
          :text="user?.firstName?.charAt(0) || 'U'"
        />
      </div>

      <!-- Text Content -->
      <div class="flex-1 space-y-4">
        <UTextarea
          v-model="text"
          placeholder="О чем вы думаете?"
          :rows="6"
          autoresize
          autofocus
          :maxrows="20"
          variant="none"
          :ui="{ 
            base: 'text-lg resize-none',
            padding: 'p-0'
          }"
        />

        <!-- Character Counter -->
        <div class="flex justify-end">
          <span 
            class="text-sm"
            :class="charCount > maxChars ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'"
          >
            {{ charCount }} / {{ maxChars }}
          </span>
        </div>

        <!-- Hashtags Input -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <UInput
            v-model="hashtags"
            icon="i-heroicons-hashtag"
            placeholder="Добавьте хэштеги через запятую или пробел"
            variant="none"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <span class="text-xs text-gray-400">необязательно</span>
            </template>
          </UInput>
        </div>
      </div>
    </div>
  </UCard>
</template>
