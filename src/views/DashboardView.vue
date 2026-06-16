<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const resources = computed(() => store.getters['resources/count'])
const bookings = computed(() => store.getters['bookings/count'])
const unreadNotifications = computed(() => store.getters['notifications/unreadCount'])
const upcoming = computed(() => store.getters['bookings/all'].slice(0, 5))

function createBooking() {
  store.dispatch('ui/openBookingDialog')
}
</script>

<template>
  <v-container class="py-8">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-sheet class="hero-sheet pa-8 rounded-xl">
          <h1 class="text-h4 font-weight-bold mb-2">Сервис бронирования общих ресурсов</h1>
          <p class="text-medium-emphasis mb-6">
            Планируй использование конференц-залов, оборудования и специалистов в одном календаре без конфликтов.
          </p>
          <v-btn color="primary" size="large" prepend-icon="mdi-calendar-plus" @click="createBooking">
            Создать бронирование
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="stat-card" rounded="xl">
          <v-card-text>
            <div class="text-medium-emphasis mb-1">Ресурсы</div>
            <div class="text-h4 font-weight-bold">{{ resources }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="stat-card" rounded="xl">
          <v-card-text>
            <div class="text-medium-emphasis mb-1">Бронирования</div>
            <div class="text-h4 font-weight-bold">{{ bookings }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="stat-card" rounded="xl">
          <v-card-text>
            <div class="text-medium-emphasis mb-1">Непрочитанные уведомления</div>
            <div class="text-h4 font-weight-bold">{{ unreadNotifications }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12">
        <v-card rounded="xl">
          <v-card-title class="font-weight-bold">Ближайшие бронирования</v-card-title>
          <v-divider />
          <v-list v-if="upcoming.length">
            <v-list-item v-for="item in upcoming" :key="item.id">
              <template #prepend>
                <v-icon icon="mdi-clock-outline" />
              </template>
              <v-list-item-title>{{ item.resourceName }} - {{ item.date }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.startTime }}-{{ item.endTime }} | {{ item.purpose }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-medium-emphasis">
            Пока нет бронирований. Нажми "Создать бронирование", чтобы начать.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
