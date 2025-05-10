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
          <div class="flex flex-col items-center">
            <UAvatar
              :src="user?.avatar"
              :alt="user?.username"
              size="2xl"
              class="mb-4"
            />
            <div class="text-center">
              <h2 class="text-2xl font-semibold">{{ user?.username }}</h2>
              <p class="text-xl text-gray-600">{{ user?.first_name }} {{ user?.last_name }}</p>
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
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { useAuth } from '~/composables/useAuth'
  import { useAuthStore } from '~/stores/auth'
  
  const route = useRoute()
  const user = ref(null)
  const loading = ref(false)
  const userUpdates = ref([])
  const isFollowing = ref(false)
  const router = useRouter()
  const auth = useAuth()
  const authStore = useAuthStore()
  
  const isCurrentUser = computed(() => {
    return user.value?.id === auth.user.value?.id
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
      // Используем Pinia store для выхода
      await authStore.logout()
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
  