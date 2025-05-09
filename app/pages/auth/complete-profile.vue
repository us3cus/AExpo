<template>
  <div class="max-w-xl mx-auto py-12 px-6">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Завершите настройку профиля</h1>
      </template>

      <div class="flex flex-col items-center gap-6">
        <div class="relative">
          <img 
            v-if="avatarPreview" 
            :src="avatarPreview" 
            class="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
            alt="Avatar preview"
          />
          <div v-else class="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
            <UIcon name="i-heroicons-user" class="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <UFormGroup label="Загрузите аватар">
          <UInput type="file" @change="onAvatarChange" accept="image/*" />
        </UFormGroup>

        <UButton color="primary" @click="connectShikimori">
          Привязать аккаунт Shikimori
        </UButton>

        <UButton color="gray" @click="finishRegistration">
          Закончить регистрацию
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const avatarPreview = ref<string | null>(null)

const onAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Создаем превью изображения
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    console.log('Selected avatar:', file.name)
  }
}

const connectShikimori = () => {
  window.location.href = 'https://shikimori.one/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK_URL&response_type=code&scope=user_rates'
}

const finishRegistration = () => {
  router.push('/')
}
</script>
  