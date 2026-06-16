<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { imageLinks } from '../data/imageLinks'
import { preloadImage } from '../utils/images'

const router = useRouter()
const fallbackAuth = 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1800&q=80'
const authBg = ref(fallbackAuth)

const authBackgroundStyle = computed(() => ({
  '--auth-bg-image': `url("${authBg.value}")`,
}))

onMounted(() => {
  preloadImage(imageLinks.authBackground, fallbackAuth, (value) => {
    authBg.value = value
  })
})

function enterApp() {
  router.push({ name: 'space' })
}
</script>

<template>
  <div class="auth-page" :style="authBackgroundStyle">
    <div class="auth-overlay">
      <div class="auth-brand">
        <div class="brand-logo-wrap">
          <v-icon icon="mdi-pencil-box-outline" size="92" />
        </div>
        <div class="brand-copy">
          <h1 class="brand-title">СБР</h1>
          <p class="brand-subtitle">Сервис бронирования<br>ресурсов</p>
        </div>
      </div>

      <div class="auth-actions">
        <v-btn class="pill-btn" size="x-large" @click="enterApp">Вход</v-btn>
        <v-btn class="pill-btn" size="x-large" @click="enterApp">Регистрация</v-btn>
      </div>

      <p class="auth-description">
        Рыбатекст используется дизайнерами, проектировщиками и фронтендерами, когда нужно быстро
        заполнить макеты или прототипы содержимым. Это тестовый контент, который не должен нести
        никакого смысла, лишь показать наличие самого текста или продемонстрировать типографику в деле.
      </p>
    </div>
  </div>
</template>
