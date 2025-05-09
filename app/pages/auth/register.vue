<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    // Здесь будет логика регистрации
    console.log('First Name:', firstName.value)
    console.log('Last Name:', lastName.value)
    console.log('Email:', email.value)
    console.log('Password:', password.value)
    
    // После успешной регистрации перенаправляем на страницу заполнения профиля
    await router.push('/auth/complete-profile')
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
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
                    v-model="firstName"
                    class="w-full"
                    id="firstName"
                    type="text"
                    placeholder="Иван"
                    required
                  />
                </UFormGroup>
                <UFormGroup label="Фамилия">
                  <UInput
                    v-model="lastName"
                    class="w-full"
                    id="lastName"
                    type="text"
                    placeholder="Иванов"
                    required
                  />
                </UFormGroup>
              </div>
              <div class="grid gap-2">
                <UFormGroup label="Email">
                  <UInput
                    v-model="email"
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
                    v-model="password"
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
          src="/assets/imgs/placeholder.jpg" 
          alt="Register" 
          class="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  </div>
</template>
