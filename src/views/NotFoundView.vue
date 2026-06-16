<template>
  <v-container class="py-24 text-center">
    <v-icon icon="mdi-map-marker-question" size="80" color="primary" class="mb-6" />
    <h1 class="text-h3 font-weight-black title-font mb-4">404</h1>
    <p class="text-h6 text-medium-emphasis mb-8">
      Такой страницы нет. Проверьте адрес или вернитесь на главную.
    </p>
    <v-btn :to="{ name: 'auth' }" color="primary" size="large" prepend-icon="mdi-home">
      На главную
    </v-btn>
  </v-container>
</template>
