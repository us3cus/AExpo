import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export interface PostUser {
  id: number
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  avatarMimeType?: string
  jwtVersion: number
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: number
  text: string
  hashtags: string[]
  mediaUrl?: string | null
  mediaMimeType?: string | null
  privacy: string
  user: PostUser
  userId: number
  createdAt: string
  updatedAt: string
}

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const isLoading = ref(false)

  const fetchPosts = async () => {
    isLoading.value = true
    const api = useApi()
    try {
      const response = await api.get('/posts')
      posts.value = response.data
    } catch (error: any) {
      console.error('Error fetching posts:', error)
      useToast().add({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось загрузить посты',
        color: 'error'
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createPost = async (postData: { text: string; mediaUrl?: string; privacy?: string }) => {
    const api = useApi()
    try {
      const response = await api.post('/posts', postData)
      await fetchPosts()
      useToast().add({
        title: 'Успех',
        description: 'Пост успешно создан',
        color: 'success'
      })
      return response.data
    } catch (error: any) {
      useToast().add({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось создать пост',
        color: 'error'
      })
      throw error
    }
  }

  return {
    posts,
    isLoading,
    fetchPosts,
    createPost
  }
})
