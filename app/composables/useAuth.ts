import { ref } from 'vue'

interface User {
  id: number
  username: string
  email: string
  avatar?: string
  shikimori_id?: number
  shikimori_username?: string
}

export const useAuth = () => {
  const user = ref<User | null>(null)

  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  const isAuthenticated = () => {
    return !!user.value
  }

  return {
    user,
    setUser,
    isAuthenticated
  }
} 