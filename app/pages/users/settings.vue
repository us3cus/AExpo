<template>
  <div class="max-w-2xl mx-auto p-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Настройки профиля</h2>
          <UButton
            :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            color="neutral"
            variant="ghost"
            @click="toggleColorMode"
          />
        </div>
      </template>

      <div class="space-y-6">
        <!-- Аватар -->
        <div class="flex flex-col items-center space-y-4">
          <div class="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary-500">
            <img
              v-if="user?.avatarUrl"
              :src="user.avatarUrl"
              alt="Аватар"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="w-24 h-24 text-gray-400" />
            </div>
          </div>
          
          <UButton
            icon="i-heroicons-camera"
            color="primary"
            variant="soft"
            @click="openFileInput"
          >
            Изменить аватар
          </UButton>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarUpload"
          />
        </div>

        <!-- Форма -->
        <form @submit.prevent="updateProfile" class="space-y-4">
          <UFormGroup label="Имя">
            <UInput v-model="form.firstName" placeholder="Введите имя" />
          </UFormGroup>

          <UFormGroup label="Фамилия">
            <UInput v-model="form.lastName" placeholder="Введите фамилию" />
          </UFormGroup>

          <UFormGroup label="Новый пароль">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Введите новый пароль"
            />
          </UFormGroup>

          <!-- Shikimori интеграция -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Shikimori</span>
              <UButton
                v-if="!user.shikimoriId"
                color="primary"
                variant="soft"
                @click="connectShikimori"
              >
                Подключить
              </UButton>
              <div v-else class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">ID: {{ user.shikimoriId }}</span>
                <UButton
                  color="error"
                  variant="soft"
                  size="xs"
                  @click="disconnectShikimori"
                >
                  Отключить
                </UButton>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <UButton
              type="submit"
              color="primary"
              :loading="loading"
              :disabled="loading"
            >
              Сохранить изменения
            </UButton>
          </div>
        </form>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAnimate } from '@vueuse/core'
import { useColorMode } from '#imports'

const colorMode = useColorMode()
const parent = ref<HTMLElement | null>(null)
const { play } = useAnimate(parent, {
  duration: 300,
  easing: 'ease-in-out'
})

const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)

const user = ref({
  id: 1,
  email: '',
  firstName: '',
  lastName: '',
  shikimoriId: '',
  avatarUrl: '',
  createdAt: '',
  updatedAt: ''
})

const form = ref({
  firstName: '',
  lastName: '',
  password: ''
})

// Переключение темы
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Подключение Shikimori
const connectShikimori = () => {
  window.location.href = '/api/auth/shikimori/login'
}

// Отключение Shikimori
const disconnectShikimori = async () => {
  try {
    const response = await fetch('/api/auth/shikimori/disconnect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (!response.ok) throw new Error('Ошибка при отключении Shikimori')
    
    user.value.shikimoriId = ''
    
    useToast().add({
      title: 'Успех',
      description: 'Shikimori успешно отключен',
      color: 'success'
    })
  } catch (error) {
    useToast().add({
      title: 'Ошибка',
      description: 'Не удалось отключить Shikimori',
      color: 'error'
    })
  }
}

// Загрузка данных пользователя
const fetchUserData = async () => {
  try {
    const response = await fetch('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()
    user.value = data
    form.value = {
      firstName: data.firstName,
      lastName: data.lastName,
      password: ''
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных пользователя:', error)
  }
}

// Обновление профиля
const updateProfile = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })
    
    if (!response.ok) throw new Error('Ошибка при обновлении профиля')
    
    const data = await response.json()
    user.value = data
    form.value.password = ''
    
    useToast().add({
      title: 'Успех',
      description: 'Профиль успешно обновлен',
      color: 'success'
    })
  } catch (error) {
    useToast().add({
      title: 'Ошибка',
      description: 'Не удалось обновить профиль',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Загрузка аватара
const openFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })

    if (!response.ok) throw new Error('Ошибка при загрузке аватара')

    const data = await response.json()
    user.value.avatarUrl = data.url

    useToast().add({
      title: 'Успех',
      description: 'Аватар успешно обновлен',
      color: 'success'
    })
  } catch (error) {
    useToast().add({
      title: 'Ошибка',
      description: 'Не удалось загрузить аватар',
      color: 'error'
    })
  }
}

// Загружаем данные при монтировании компонента
onMounted(() => {
  fetchUserData()
})
</script>