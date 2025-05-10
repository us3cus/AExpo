import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  token: string | null
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token
  },

  actions: {
    setToken(token: string) {
      this.token = token
      const tokenCookie = useCookie('access_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        path: '/',
        secure: true
      })
      tokenCookie.value = token
    },

    setUser(user: User) {
      this.user = user
      const userCookie = useCookie('user', {
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        path: '/',
        secure: true
      })
      userCookie.value = JSON.stringify(user)
    },

    async login(email: string, password: string) {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка при входе')
      }

      const data = await response.json()
      this.setToken(data.access_token)

      // Получаем профиль пользователя
      const profileResponse = await fetch('http://localhost:5001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      })

      if (!profileResponse.ok) {
        throw new Error('Ошибка при получении профиля')
      }

      const profile = await profileResponse.json()
      this.setUser(profile)

      return profile
    },

    async register(email: string, password: string, firstName: string, lastName: string) {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, firstName, lastName })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка при регистрации')
      }

      // После успешной регистрации выполняем автоматический вход
      return await this.login(email, password)
    },

    async logout() {
      this.token = null
      this.user = null
      const tokenCookie = useCookie('access_token')
      const userCookie = useCookie('user')
      tokenCookie.value = null
      userCookie.value = null
    },

    async init() {
      const tokenCookie = useCookie('access_token')
      const userCookie = useCookie('user')

      if (tokenCookie.value && userCookie.value) {
        try {
          this.token = tokenCookie.value
          this.user = typeof userCookie.value === 'string' 
            ? JSON.parse(userCookie.value)
            : userCookie.value
        } catch (error) {
          console.error('Ошибка при инициализации auth store:', error)
          // Очищаем невалидные куки
          this.logout()
        }
      }
    }
  }
}) 