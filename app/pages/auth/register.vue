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
  password: '',
  firstName: '',
  lastName: ''
})

const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    const user = await authStore.register(
      form.value.email,
      form.value.password,
      form.value.firstName,
      form.value.lastName
    )
    
    toast.add({
      title: 'Успешная регистрация',
      description: `Добро пожаловать, ${user.firstName}!`,
      color: 'success'
    })

    // После успешной регистрации и входа перенаправляем на страницу заполнения профиля
    await router.push('/auth/complete-profile')
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
                Регистрация
              </h1>
              <p class="text-sm text-gray-500">
                Создайте новый аккаунт
              </p>
            </div>
            <div class="grid gap-6">
              <div class="grid grid-cols-2 gap-4">
                <UFormGroup label="Имя">
                  <UInput
                    v-model="form.firstName"
                    class="w-full"
                    id="firstName"
                    type="text"
                    placeholder="Иван"
                    required
                    minlength="2"
                  />
                </UFormGroup>
                <UFormGroup label="Фамилия">
                  <UInput
                    v-model="form.lastName"
                    class="w-full"
                    id="lastName"
                    type="text"
                    placeholder="Иванов"
                    required
                    minlength="2"
                  />
                </UFormGroup>
              </div>
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
                    minlength="6"
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
                Зарегистрироваться
              </UButton>
            </div>
            <div class="text-center text-sm">
              Уже есть аккаунт?
              <NuxtLink
                to="/auth/login"
                class="text-primary hover:underline"
              >
                Войти
              </NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="relative hidden bg-gray-100 lg:block">
      <div class="absolute inset-0">
        <img 
          src="/assets/images/placeholder.jpg" 
          alt="Register" 
          class="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  </div>
</template>
