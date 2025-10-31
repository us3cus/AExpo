import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/auth'

interface Post {
  id: number
  content: string
  createdAt: string
  updatedAt: string
}

interface PostsState {
  posts: Post[]
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: []
  }),
  actions: {
    async createPost(content: string) {
      const authStore = useAuthStore()
      const token = authStore.getToken

      const api = useApi()

      const response = await api.post<Post>('/posts', { content, headers: { Authorization: `Bearer ${token}` } })

      this.posts.unshift(response.data)
      return response.data
    }
  }
})
