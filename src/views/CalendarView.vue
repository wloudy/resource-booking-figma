<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const selectedDate = ref(new Date().toISOString().slice(0, 10))

const resources = computed(() => store.getters['resources/all'])
const bookingsByDate = computed(() => store.getters['bookings/byDate'](selectedDate.value))

function bookingsForResource(resourceId) {
  return bookingsByDate.value.filter((item) => item.resourceId === resourceId)
}

function openBooking() {
  store.dispatch('ui/openBookingDialog')
}
</script>

<template>
  <v-container class="py-8">
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="selectedDate"
          type="date"
          label="Дата расписания"
          variant="outlined"
          prepend-inner-icon="mdi-calendar"
        />
      </v-col>
      <v-col cols="12" md="8" class="d-flex align-center justify-md-end">
        <v-btn color="primary" prepend-icon="mdi-calendar-plus" @click="openBooking">Новое бронирование</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="resource in resources" :key="resource.id" cols="12" md="6" lg="4">
        <v-card rounded="xl" class="h-100">
          <v-card-title class="text-subtitle-1 font-weight-bold">{{ resource.name }}</v-card-title>
          <v-card-subtitle>{{ resource.type }} | {{ resource.location }}</v-card-subtitle>
          <v-divider class="my-2" />
          <v-list v-if="bookingsForResource(resource.id).length">
            <v-list-item v-for="booking in bookingsForResource(resource.id)" :key="booking.id">
              <v-list-item-title>{{ booking.startTime }}-{{ booking.endTime }}</v-list-item-title>
              <v-list-item-subtitle>{{ booking.purpose }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-medium-emphasis">
            На выбранную дату ресурс свободен.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
