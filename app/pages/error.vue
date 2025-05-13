<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UCard class="max-w-md w-full text-center">
      <div class="flex flex-col items-center gap-6">
        <!-- Иконка -->
        <div class="flex justify-center">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-16 h-16 text-orange-500"
          />
        </div>

        <!-- Заголовок -->
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ errorData.statusMessage }}
          </h1>
          <p class="text-gray-600">
            {{ errorData.message }}
          </p>
        </div>

        <!-- Код ошибки -->
        <UBadge
          :color="errorData.statusCode >= 500 ? 'error' : 'warning'"
          variant="soft"
          size="lg"
        >
          Ошибка {{ errorData.statusCode }}
        </UBadge>

        <!-- Кнопки действий -->
        <div class="flex flex-col gap-3 w-full">
          <UButton
            to="/"
            color="primary"
            block
            size="lg"
          >
            Вернуться на главную
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const error = useError()

// Создаем реактивный объект с данными об ошибке
const errorData = ref({
  statusCode: 404,
  statusMessage: 'Страница не найдена',
  message: 'К сожалению, запрашиваемая страница не существует.'
})

// При монтировании компонента обновляем данные об ошибке, если они есть
onMounted(() => {
  if (error.value) {
    errorData.value = {
      statusCode: error.value.statusCode || 404,
      statusMessage: error.value.statusMessage || 'Страница не найдена',
      message: error.value.message || 'К сожалению, запрашиваемая страница не существует.'
    }
  }
})
</script>