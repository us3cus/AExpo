<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    const user = await authStore.login(form.value.email, form.value.password)
    
    toast.add({
      title: 'Успешный вход',
      description: `Добро пожаловать, ${user.firstName}!`,
      color: 'success'
    })

    router.push('/')
  } catch (error: any) {
    toast.add({
      title: 'Ошибка',
      description: error.message,
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const handleShikimoriLogin = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/auth/shikimori/login')
    if (!response.ok) {
      throw new Error('Ошибка при перенаправлении на Shikimori')
    }
    // Перенаправляем на страницу авторизации Shikimori
    window.location.href = response.url
  } catch (error: any) {
    toast.add({
      title: 'Ошибка',
      description: error.message,
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <NuxtLink to="/" class="flex items-center gap-2 font-medium">
          <div class="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white">
            <Icon name="vscode-icons:file-type-firebase" class="h-8 w-8" />
          </div>
          Æxpo
        </NuxtLink>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-md">
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
            <div class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">
                Вход в аккаунт
              </h1>
              <p class="text-sm text-gray-500">
                Введите ваш email для входа в аккаунт
              </p>
            </div>
            <div class="grid gap-6">
              <div class="grid gap-2">
                <UFormGroup label="Email">
                  <UInput
                    v-model="form.email"
                    class="w-full"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </UFormGroup>
              </div>
              <div class="grid gap-2">
                <UFormGroup label="Пароль">
                  <UInput
                    v-model="form.password"
                    class="w-full"
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                </UFormGroup>
              </div>

              <UButton
                type="submit"
                color="primary"
                block
                :loading="isLoading"
                :disabled="isLoading"
              >
                Войти
              </UButton>
              <div class="relative text-center text-sm">
                <div class="relative flex justify-center">
                  <span class="px-2 text-gray-500">
                    Или продолжить с
                  </span>
                </div>
              </div>
              <UButton
                color="neutral"
                variant="outline"
                block
                @click="handleShikimoriLogin"
                :loading="isLoading"
                :disabled="isLoading"
              >
                <template #leading>
                  <Icon name="simple-icons:shikimori" class="h-5 w-5" />
                </template>
                Войти через Shikimori
              </UButton>
            </div>
            <div class="text-center text-sm">
              Нет аккаунта?
              <NuxtLink
                to="/auth/register"
                class="text-primary hover:underline"
              >
                Зарегистрироваться
              </NuxtLink>
              или
              <NuxtLink
                to="/auth/forgot-password"
                class="text-primary hover:underline"
              >
                Восстановить пароль
              </NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="relative hidden bg-gray-100 lg:block">
      <div class="absolute inset-0">
        <img 
          src="/assets/imgs/placeholder.jpg" 
          alt="Register" 
          class="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  </div>
</template>