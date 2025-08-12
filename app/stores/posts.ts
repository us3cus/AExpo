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

      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка при создании поста')
      }

      const post = await response.json()
      this.posts.unshift(post)
      return post
    }
  }
})
