<template>
  <div class="max-w-2xl mx-auto p-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-arrow-left"
              color="neutral"
              variant="ghost"
              @click="$router.push('/users/profile')"
            />
            <h2 class="text-xl font-bold">Настройки профиля</h2>
          </div>
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
            >
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="w-24 h-24 text-gray-400" />
            </div>
          </div>
          
          <div v-if="user?.firstName || user?.lastName" class="text-center">
            <p class="text-lg font-semibold">{{ user.firstName }} {{ user.lastName }}</p>
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
          >
        </div>

        <!-- Форма -->
        <form class="space-y-4" @submit.prevent="updateProfile">
          <div class="space-y-1">
            <label class="text-sm font-medium">Имя</label>
            <UInput v-model="form.firstName" placeholder="Введите имя" />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Фамилия</label>
            <UInput v-model="form.lastName" placeholder="Введите фамилию" />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Текущий пароль</label>
            <UInput
              v-model="form.currentPassword"
              type="password"
              placeholder="Введите текущий пароль для подтверждения"
              required
            />
            <p class="text-xs text-gray-500">Обязательное поле для любых изменений</p>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Новый пароль (необязательно)</label>
            <UInput
              v-model="form.newPassword"
              type="password"
              placeholder="Введите новый пароль, если хотите изменить"
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
const authStore = useAuthStore()

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
  currentPassword: '',
  newPassword: ''
})

// Храним исходные данные для сравнения
const originalData = ref({
  firstName: '',
  lastName: ''
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
    
    // Сохраняем исходные данные
    originalData.value = {
      firstName: data.firstName || '',
      lastName: data.lastName || ''
    }
    
    // Заполняем форму только именем и фамилией, пароли оставляем пустыми
    form.value = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      currentPassword: '',
      newPassword: ''
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    useToast().add({
      title: 'Ошибка',
      description: err.response?.data?.message || 'Не удалось загрузить данные пользователя',
      color: 'error'
    })
  }
}

// Обновление профиля
const updateProfile = async () => {
  // Проверяем, были ли изменения
  const hasNameChanges = 
    form.value.firstName !== originalData.value.firstName || 
    form.value.lastName !== originalData.value.lastName
  
  const hasPasswordChange = form.value.newPassword && form.value.newPassword.trim() !== ''
  
  // Если нет изменений, не отправляем запрос
  if (!hasNameChanges && !hasPasswordChange) {
    useToast().add({
      title: 'Информация',
      description: 'Нет изменений для сохранения',
      color: 'primary'
    })
    return
  }
  
  // Проверяем наличие текущего пароля (обязательное поле)
  if (!form.value.currentPassword || form.value.currentPassword.trim() === '') {
    useToast().add({
      title: 'Ошибка',
      description: 'Введите текущий пароль для подтверждения изменений',
      color: 'error'
    })
    return
  }
  
  loading.value = true
  try {
    // Формируем данные для отправки
    const updateData: Record<string, string> = {
      currentPassword: form.value.currentPassword
    }
    
    if (hasNameChanges) {
      updateData.firstName = form.value.firstName
      updateData.lastName = form.value.lastName
    }
    
    if (hasPasswordChange) {
      updateData.newPassword = form.value.newPassword
    }
    
    const { data } = await api.patch('/auth/profile', updateData)
    
    // Если пароль был изменен, получим новый токен
    if (data.access_token) {
      // Сохраняем новый токен
      authStore.setToken(data.access_token)
      
      useToast().add({
        title: 'Успех',
        description: 'Пароль изменен. Выполнен повторный вход с новым токеном.',
        color: 'success'
      })
    } else {
      useToast().add({
        title: 'Успех',
        description: 'Профиль успешно обновлен',
        color: 'success'
      })
    }
    
    // Обновляем данные пользователя
    if (data.user) {
      user.value = data.user
      
      // Обновляем исходные данные после успешного сохранения
      originalData.value = {
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || ''
      }
    }
    
    // Очищаем поля паролей
    form.value.currentPassword = ''
    form.value.newPassword = ''
    
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    useToast().add({
      title: 'Ошибка',
      description: err.response?.data?.message || 'Не удалось обновить профиль',
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
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    useToast().add({
      title: 'Ошибка',
      description: err.response?.data?.message || 'Не удалось загрузить аватар',
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