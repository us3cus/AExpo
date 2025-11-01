<script setup lang="ts">
const privacy = defineModel<string>('privacy', { required: true })

interface Props {
  disabled?: boolean
  filesCount?: number
  maxFiles?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  filesCount: 0,
  maxFiles: 10
})

const emit = defineEmits<{
  uploadMedia: []
}>()

const isMediaDisabled = computed(() => 
  props.disabled || props.filesCount >= props.maxFiles
)
</script>

<template>
  <UCard :ui="{ body: { padding: 'p-4' } }">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <!-- Media Upload Button -->
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-photo"
          size="lg"
          square
          @click="emit('uploadMedia')"
          :disabled="isMediaDisabled"
        />

        <!-- Emoji Button (placeholder) -->
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-face-smile"
          size="lg"
          square
          :disabled="disabled"
        />

        <!-- Poll Button (placeholder) -->
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-chart-bar"
          size="lg"
          square
          :disabled="disabled"
        />
      </div>

      <!-- Privacy Selector -->
      <PostPrivacySelector v-model="privacy" :disabled="disabled" />
    </div>
  </UCard>
</template>
