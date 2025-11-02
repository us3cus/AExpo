export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()
  
  if (!user.value) {
    useToast().add({
      title: 'Требуется авторизация',
      description: 'Пожалуйста, войдите в систему',
      color: 'warning'
    })
    return navigateTo('/login')
  }
})
