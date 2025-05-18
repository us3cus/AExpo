<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Главная страница</h1>
      <div class="flex gap-2">
        <UButton
          v-if="auth.user.value"
          :to="'/users/profile'"
          color="primary"
          variant="soft"
        >
          Профиль
        </UButton>
        <UButton
          v-else
          to="/auth/login"
          color="primary"
        >
          Войти
        </UButton>
      </div>
    </div>
    <!-- Остальной контент страницы -->
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()
</script>

