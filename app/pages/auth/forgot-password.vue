<script lang="ts">
export const description = 'A simple email-only login page.'
</script>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const toast = useToast()

const email = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    
    const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.value })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Ошибка при отправке инструкций')
    }

    toast.add({
      title: 'Успешно',
      description: 'Инструкции по восстановлению пароля отправлены на ваш email',
      color: 'success'
    })

    // Перенаправляем на страницу входа
    await router.push('/auth/login')
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
                Восстановление пароля
              </h1>
              <p class="text-sm text-gray-500">
                Введите ваш email для восстановления пароля
              </p>
            </div>
            <div class="grid gap-6">
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

              <UButton
                type="submit"
                color="primary"
                block
                :loading="isLoading"
                :disabled="isLoading"
              >
                Отправить инструкции
              </UButton>
            </div>
            <div class="text-center text-sm">
              <NuxtLink
                to="/auth/login"
                class="text-primary hover:underline"
              >
                Вернуться к входу
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