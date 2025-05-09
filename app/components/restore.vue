<script setup lang="ts">
const email = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    // Здесь будет логика отправки формы
    console.log('Email:', email.value)
  } catch (error) {
    console.error('Ошибка при отправке формы:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="w-full space-y-6">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold">Вход</h1>
      <p class="text-gray-500">Введите ваш email для входа</p>
    </div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="name@example.com"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ isLoading ? 'Загрузка...' : 'Войти' }}
      </button>
    </form>
  </div>
</template> 