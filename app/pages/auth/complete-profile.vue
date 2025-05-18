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

        <UButton color="neutral" @click="finishRegistration">
          Закончить регистрацию
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const avatarPreview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const toast = useToast()
const authStore = useAuthStore()

const onAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Проверяем размер файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        title: 'Ошибка',
        description: 'Размер файла не должен превышать 5MB',
        color: 'error'
      })
      return
    }

    // Проверяем тип файла
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.add({
        title: 'Ошибка',
        description: 'Поддерживаются только форматы JPG, PNG и GIF',
        color: 'error'
      })
      return
    }

    selectedFile.value = file
    // Создаем превью изображения
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const uploadAvatar = async () => {
  if (!selectedFile.value) return

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await fetch('http://localhost:5001/api/upload/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${authStore.getToken}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Ошибка при загрузке аватара')
    }

    const data = await response.json()
    toast.add({
      title: 'Успешно',
      description: 'Аватар успешно загружен',
      color: 'success'
    })
    return data.url
  } catch (error: any) {
    toast.add({
      title: 'Ошибка',
      description: error.message || 'Ошибка при загрузке аватара',
      color: 'error'
    })
    console.error('Error uploading avatar:', error)
    return null
  }
}

const connectShikimori = () => {
  window.location.href = 'http://localhost:5001/api/auth/shikimori/login'
}

const finishRegistration = async () => {
  if (selectedFile.value) {
    const avatarUrl = await uploadAvatar()
    if (!avatarUrl) {
      return
    }
  }
  router.push('/')
}
</script>
  