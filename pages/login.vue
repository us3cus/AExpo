<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <UCard class="w-full max-w-md" v-auto-animate>
      <template #header>
        <h2 class="text-2xl font-bold text-center text-gray-900">Вход в систему</h2>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UFormGroup label="Email" name="email">
          <UInput
            v-model="email"
            type="email"
            placeholder="Введите ваш email"
            required
          />
        </UFormGroup>

        <UFormGroup label="Пароль" name="password">
          <UInput
            v-model="password"
            type="password"
            placeholder="Введите ваш пароль"
            required
          />
        </UFormGroup>

        <div class="flex items-center justify-between">
          <UCheckbox
            v-model="rememberMe"
            label="Запомнить меня"
          />
          <UButton
            variant="link"
            to="/forgot-password"
          >
            Забыли пароль?
          </UButton>
        </div>

        <UButton
          type="submit"
          color="primary"
          block
          :loading="loading"
        >
          Войти
        </UButton>
      </form>

      <template #footer>
        <div class="text-center">
          <span class="text-gray-600">Нет аккаунта?</span>
          <UButton
            variant="link"
            to="/register"
            class="ml-1"
          >
            Зарегистрироваться
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    // Здесь будет логика авторизации
    console.log('Login attempt:', { email: email.value, password: password.value })
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>
