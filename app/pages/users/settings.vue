<template>
  <div class="max-w-2xl mx-auto p-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Настройки профиля</h2>
          <UButton
            v-if="isMounted"
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
          <div class="space-y-1">
            <label class="text-sm font-medium">Имя</label>
            <UInput v-model="form.firstName" placeholder="Введите имя" />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Фамилия</label>
            <UInput v-model="form.lastName" placeholder="Введите фамилию" />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Новый пароль</label>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Введите новый пароль"
            />
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

const api = useApi()

const colorMode = useColorMode()
const parent = ref<HTMLElement | null>(null)
const _play = useAnimate(parent, {
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

// Загрузка данных пользователя
const fetchUserData = async () => {
  try {
    const { data } = await api.get('users/me')
    user.value = data
    form.value = {
      firstName: data.firstName,
      lastName: data.lastName,
      password: ''
    }
  } catch (error: any) {
    useToast().add({
      title: 'Ошибка',
      description: error.response?.data?.message || 'Не удалось загрузить данные пользователя',
      color: 'error'
    })
  }
}

// Обновление профиля
const updateProfile = async () => {
  loading.value = true
  try {
    const { data } = await api.patch('/auth/profile', form.value)
    user.value = data
    form.value.password = ''
    
    useToast().add({
      title: 'Успех',
      description: 'Профиль успешно обновлен',
      color: 'success'
    })
  } catch (error: any) {
    useToast().add({
      title: 'Ошибка',
      description: error.response?.data?.message || 'Не удалось обновить профиль',
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
    const { data } = await api.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    user.value.avatarUrl = data.url

    useToast().add({
      title: 'Успех',
      description: 'Аватар успешно обновлен',
      color: 'success'
    })
  } catch (error: any) {
    useToast().add({
      title: 'Ошибка',
      description: error.response?.data?.message || 'Не удалось загрузить аватар',
      color: 'error'
    })
  }
}
const isMounted = ref(false)
// Загружаем данные при монтировании компонента
onMounted(() => {
  isMounted.value = true
  fetchUserData()
})
</script>