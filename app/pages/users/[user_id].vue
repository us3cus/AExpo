<template>
  <div class="container mx-auto p-4">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Профиль пользователя</h1>
          <div class="flex gap-2">
            <UButton
              v-if="!isCurrentUser"
              :loading="loading"
              @click="handleFollow"
            >
              {{ isFollowing ? 'Отписаться' : 'Подписаться' }}
            </UButton>
            <UButton
              v-if="isCurrentUser"
              color="red"
              variant="soft"
              @click="handleLogout"
            >
              Выйти
            </UButton>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <!-- Аватар и основная информация -->
        <div class="flex items-start gap-6">
          <div class="relative group">
            <UAvatar
              :src="user?.avatar || '/default-avatar.png'"
              size="xl"
              class="cursor-pointer"
              @click="openAvatarUpload"
            />
            <div
              v-if="isCurrentUser"
              class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
              @click="openAvatarUpload"
            >
              <UIcon name="i-heroicons-camera" class="text-white text-xl" />
            </div>
          </div>

          <div class="flex-1">
            <h2 class="text-xl font-semibold">{{ user?.username }}</h2>
            <p class="text-gray-600">{{ user?.email }}</p>
            <div class="mt-2">
              <UBadge v-if="user?.shikimori_id" color="green">
                Shikimori: {{ user?.shikimori_username }}
              </UBadge>
              <UButton
                v-else-if="isCurrentUser"
                size="sm"
                color="gray"
                @click="connectShikimori"
              >
                Привязать Shikimori
              </UButton>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div class="grid grid-cols-3 gap-4">
          <UCard>
            <template #header>
              <div class="text-center font-medium">Подписчики</div>
            </template>
            <div class="text-center text-2xl font-bold">{{ user?.followers_count || 0 }}</div>
          </UCard>
          <UCard>
            <template #header>
              <div class="text-center font-medium">Подписки</div>
            </template>
            <div class="text-center text-2xl font-bold">{{ user?.following_count || 0 }}</div>
          </UCard>
          <UCard>
            <template #header>
              <div class="text-center font-medium">Аниме в списке</div>
            </template>
            <div class="text-center text-2xl font-bold">{{ user?.anime_list_count || 0 }}</div>
          </UCard>
        </div>

        <!-- Последние обновления -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Последние обновления</h3>
          <div v-auto-animate>
            <UCard
              v-for="update in userUpdates"
              :key="update.id"
              class="mb-4"
            >
              <div class="flex items-center gap-4">
                <UAvatar :src="update.anime?.poster" size="sm" />
                <div>
                  <div class="font-medium">{{ update.anime?.title }}</div>
                  <div class="text-sm text-gray-600">
                    {{ update.type }} - {{ formatDate(update.created_at) }}
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Модальное окно загрузки аватара -->
    <UModal v-model="showAvatarUpload">
      <UCard>
        <template #header>
          <div class="text-lg font-semibold">Загрузка аватара</div>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Выберите изображение">
            <UInput
              type="file"
              accept="image/*"
              @change="handleAvatarUpload"
            />
          </UFormGroup>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const user = ref(null)
const loading = ref(false)
const showAvatarUpload = ref(false)
const userUpdates = ref([])
const isFollowing = ref(false)
const router = useRouter()
const auth = useAuth()

const isCurrentUser = computed(() => {
  return user.value?.id === useAuth().user?.id
})

// Загрузка данных пользователя
const fetchUserData = async () => {
  try {
    const { data } = await useFetch(`/api/users/${route.params.user_id}`)
    user.value = data.value
    isFollowing.value = data.value.is_following
  } catch (error) {
    console.error('Ошибка при загрузке данных пользователя:', error)
  }
}

// Загрузка обновлений пользователя
const fetchUserUpdates = async () => {
  try {
    const { data } = await useFetch(`/api/users/${route.params.user_id}/updates`)
    userUpdates.value = data.value
  } catch (error) {
    console.error('Ошибка при загрузке обновлений:', error)
  }
}

// Обработка подписки/отписки
const handleFollow = async () => {
  loading.value = true
  try {
    await useFetch(`/api/users/${route.params.user_id}/follow`, {
      method: isFollowing.value ? 'DELETE' : 'POST'
    })
    isFollowing.value = !isFollowing.value
    user.value.followers_count += isFollowing.value ? 1 : -1
  } catch (error) {
    console.error('Ошибка при обработке подписки:', error)
  } finally {
    loading.value = false
  }
}

// Обработка загрузки аватара
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const { data } = await useFetch('/api/users/avatar', {
      method: 'POST',
      body: formData
    })
    user.value.avatar = data.value.avatar_url
    showAvatarUpload.value = false
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error)
  }
}

// Подключение Shikimori
const connectShikimori = () => {
  window.location.href = '/api/auth/shikimori'
}

// Форматирование даты
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleLogout = async () => {
  try {
    await useFetch('/api/auth/logout', {
      method: 'POST'
    })
    // Очищаем хранилище
    auth.user = null
    // Перенаправляем на главную
    router.push('/')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}

// Инициализация
onMounted(() => {
  fetchUserData()
  fetchUserUpdates()
})
</script>
