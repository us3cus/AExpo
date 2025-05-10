import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

interface User {
  id: number
  username: string
  email: string
  avatar?: string
  shikimori_id?: number
  shikimori_username?: string
}

export const useAuth = () => {
  const authStore = useAuthStore()

  return {
    user: computed(() => authStore.user),
    setUser: (user: any) => authStore.setUser(user),
    isAuthenticated: () => authStore.isAuthenticated
  }
} 