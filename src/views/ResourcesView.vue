<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const resources = computed(() => store.getters['resources/all'])

function createResource() {
  store.dispatch('ui/openResourceDialog')
}

function editResource(resource) {
  store.dispatch('ui/openResourceDialog', resource)
}

function deleteResource(resource) {
  store.dispatch('resources/deleteResource', resource.id)
  store.dispatch('bookings/deleteBookingsByResource', resource.id)
  store.dispatch('notifications/createNotification', {
    title: 'Ресурс удален',
    text: `Ресурс "${resource.name}" удален вместе со связанными бронированиями.`,
    kind: 'resource_removed',
  })
  store.dispatch('ui/showSnackbar', {
    message: `Ресурс "${resource.name}" удален.`,
    color: 'warning',
  })
}
</script>

<template>
  <v-container class="py-8">
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="text-h5 font-weight-bold">Управление ресурсами</h1>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="createResource">Добавить ресурс</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="item in resources" :key="item.id" cols="12" md="6">
        <v-card rounded="xl" class="h-100">
          <v-card-title class="font-weight-bold">{{ item.name }}</v-card-title>
          <v-card-subtitle>{{ item.type }} | {{ item.location }}</v-card-subtitle>
          <v-card-text>
            <div class="mb-2"><strong>Ответственный:</strong> {{ item.manager }}</div>
            <div><strong>Вместимость:</strong> {{ item.capacity }}</div>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn variant="outlined" prepend-icon="mdi-pencil-outline" @click="editResource(item)">
              Редактировать
            </v-btn>
            <v-btn color="error" variant="tonal" prepend-icon="mdi-delete-outline" @click="deleteResource(item)">
              Удалить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
