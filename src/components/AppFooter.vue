<template>
  <v-footer class="px-6 py-4 mt-10" color="rgba(0,0,0,0.75)">
    <v-row class="w-100 align-center">
      <v-col cols="12" md="8" class="text-medium-emphasis">
        © {{ new Date().getFullYear() }} Resource Booking. Управление общими ресурсами внутри организации.
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-md-end ga-2">
        <v-chip size="small" color="primary" variant="tonal">Vue 3</v-chip>
        <v-chip size="small" color="secondary" variant="outlined">Vuex</v-chip>
        <v-chip size="small" color="info" variant="outlined">Vuetify</v-chip>
      </v-col>
    </v-row>
  </v-footer>
</template>
