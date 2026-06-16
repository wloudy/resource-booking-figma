<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const bookings = computed(() => store.getters['bookings/all'])

function cancelBooking(item) {
  store.dispatch('bookings/deleteBooking', item)
  store.dispatch('ui/showSnackbar', {
    message: 'Бронирование отменено.',
    color: 'warning',
  })
}

function openBooking() {
  store.dispatch('ui/openBookingDialog')
}
</script>

<template>
  <v-container class="py-8">
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="text-h5 font-weight-bold">Все бронирования</h1>
        <v-btn color="primary" prepend-icon="mdi-calendar-plus" @click="openBooking">
          Добавить
        </v-btn>
      </v-col>
    </v-row>

    <v-card rounded="xl">
      <v-table>
        <thead>
          <tr>
            <th>Ресурс</th>
            <th>Дата</th>
            <th>Время</th>
            <th>Цель</th>
            <th>Участники</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in bookings" :key="item.id">
            <td>{{ item.resourceName }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.startTime }}-{{ item.endTime }}</td>
            <td>{{ item.purpose }}</td>
            <td>{{ item.participants.length ? item.participants.join(', ') : '-' }}</td>
            <td>
              <v-btn
                color="error"
                variant="text"
                size="small"
                prepend-icon="mdi-close-circle-outline"
                @click="cancelBooking(item)"
              >
                Отменить
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-card-text v-if="!bookings.length" class="text-medium-emphasis">
        Бронирований пока нет.
      </v-card-text>
    </v-card>
  </v-container>
</template>
