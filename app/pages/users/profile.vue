<template>
    <div class="container mx-auto p-4">
              <div class="flex justify-center gap-2 md:justify-start">
        <NuxtLink to="/" class="mb-6 flex items-center gap-2 font-medium">
          <div class="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white">
            <Icon name="vscode-icons:file-type-firebase" class="h-8 w-8" />
          </div>
          Æxpo
        </NuxtLink>
      </div>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Профиль пользователя</h1>
            <div class="flex gap-2">
              <UDropdownMenu
                size="xl"
                :items="items"
                :content="{
                  align: 'start'
                }"
                :ui="{
                  content: 'w-48'
                }"
              >
                <UButton size="xl" label="Open" icon="i-lucide-menu" color="neutral" variant="outline" />
              </UDropdownMenu>
            </div>
          </div>
        </template>
  
        <div class="space-y-6">
          <!-- Аватар и основная информация -->
          <div class="flex flex-col items-center">
            <div class="relative">
              <UAvatar
                :src="user?.avatarUrl || 'https://sun9-61.userapi.com/impg/uaHyDsEbOviHz4I-xt17hvvQi8WdyW4Lh3oZhg/AHTzMO0-Ju8.jpg?size=2400x2400&quality=95&sign=ed29003b97428007b6e3686ea0a77ca4&type=album'"
                :alt="user?.firstName"
                size="3xl"
                class="mb-4 w-48 h-48"
              />
            </div>
            <div class="text-center">
              <h2 class="text-3xl font-bold mb-2">{{ user?.firstName }} {{ user?.lastName }}</h2>
              <p class="text-xl">{{ user?.email }}</p>
              <div class="mt-2">
                <UBadge v-if="user?.shikimoriId" color="green">
                  Shikimori: {{ user?.shikimoriId }}
                </UBadge>
              </div>
            </div>
          </div>
  
          <!-- Статистика -->
          <div class="grid grid-cols-3 gap-4">
            <UCard>
              <template #header>
                <div class="text-center font-medium">Подписчики</div>
              </template>
              <div class="text-center text-2xl font-bold">{{ user?.followersCount || 0 }}</div>
            </UCard>
            <UCard>
              <template #header>
                <div class="text-center font-medium">Подписки</div>
              </template>
              <div class="text-center text-2xl font-bold">{{ user?.followingCount || 0 }}</div>
            </UCard>
            <UCard>
              <template #header>
                <div class="text-center font-medium">Аниме в списке</div>
              </template>
              <div class="text-center text-2xl font-bold">{{ user?.animeListCount || 0 }}</div>
            </UCard>
          </div>
  
          
        </div>
      </UCard>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from '#app'
import { useFetch } from '#app'

const user = ref(null)
const loading = ref(true)

const authStore = useAuthStore()
const router = useRouter()

const fetchUserData = async () => {
  try {
    const token = authStore.token // access_token должен быть в сторе
    const { data, error } = await useFetch('http://localhost:5001/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (error.value) {
      console.error('Ошибка при загрузке данных:', error.value)
    } else {
      user.value = data.value
      console.log(data.value);
    }
  } catch (e) {
    console.error('Ошибка запроса:', e)
  } finally {
    loading.value = false
  }
}

const items = ref<DropdownMenuItem[]>([
  {
    label: 'Настройки',
    icon: 'i-lucide-cog',
    onSelect() {
    handleSettings()
    }
  },  
  {
    label: 'Выйти',
    icon: 'ep:setting',
    onSelect() {
    handleLogout()
    }
  },

])

onMounted(fetchUserData)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
const handleSettings = () => {
  router.push('/users/settings')
}
</script>


  