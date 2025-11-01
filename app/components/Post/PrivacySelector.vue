<script setup lang="ts">
const privacy = defineModel<string>({ required: true })

interface Props {
  disabled?: boolean
}

defineProps<Props>()

const showMenu = ref(false)

const privacyOptions = [
  { 
    label: 'Публичный', 
    value: 'public',
    icon: 'i-heroicons-globe-alt',
    description: 'Виден всем'
  },
  { 
    label: 'Только друзья', 
    value: 'friends',
    icon: 'i-heroicons-user-group',
    description: 'Виден только друзьям'
  },
  { 
    label: 'Приватный', 
    value: 'private',
    icon: 'i-heroicons-lock-closed',
    description: 'Виден только вам'
  }
]

const currentPrivacy = computed(() => 
  privacyOptions.find(opt => opt.value === privacy.value)
)

const selectPrivacy = (value: string) => {
  privacy.value = value
  showMenu.value = false
}
</script>

<template>
  <UPopover v-model:open="showMenu" :popper="{ placement: 'bottom-end' }">
    <UButton
      color="gray"
      variant="ghost"
      :icon="currentPrivacy?.icon"
      trailing-icon="i-heroicons-chevron-down"
      :disabled="disabled"
    >
      {{ currentPrivacy?.label }}
    </UButton>

    <template #panel>
      <div class="p-2 w-64">
        <div
          v-for="option in privacyOptions"
          :key="option.value"
          class="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-100 dark:bg-gray-800': privacy === option.value }"
          @click="selectPrivacy(option.value)"
        >
          <UIcon :name="option.icon" class="w-5 h-5 mt-0.5 text-gray-600 dark:text-gray-400" />
          <div class="flex-1">
            <p class="font-medium text-sm text-gray-900 dark:text-white">{{ option.label }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ option.description }}</p>
          </div>
          <UIcon
            v-if="privacy === option.value"
            name="i-heroicons-check"
            class="w-5 h-5 text-primary"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
