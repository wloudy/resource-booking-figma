<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const notifications = computed(() => store.getters['notifications/all'])

const syncEnabled = computed({
  get: () => store.state.notifications.syncEnabled,
  set: (value) => store.dispatch('notifications/setSyncEnabled', value),
})

function markAllRead() {
  store.dispatch('notifications/markAllRead')
  store.dispatch('ui/showSnackbar', {
    message: 'Все уведомления отмечены как прочитанные.',
    color: 'success',
  })
}

function syncLabel(kind) {
  if (kind === 'booking_created') return 'Создание бронирования'
  if (kind === 'booking_cancelled') return 'Отмена бронирования'
  if (kind === 'resource_removed') return 'Удаление ресурса'
  return 'Системное событие'
}
</script>

<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" md="5">
        <v-card rounded="xl" class="mb-4">
          <v-card-title class="font-weight-bold">Синхронизация</v-card-title>
          <v-card-text>
            <v-switch
              v-model="syncEnabled"
              color="primary"
              label="Синхронизировать события с календарями сотрудников"
              hide-details
            />
            <p class="text-medium-emphasis mt-4 mb-0">
              При включенной синхронизации каждое бронирование автоматически отправляется в уведомления участников.
            </p>
          </v-card-text>
        </v-card>
        <v-btn variant="outlined" prepend-icon="mdi-check-all" @click="markAllRead">
          Отметить все как прочитанные
        </v-btn>
      </v-col>

      <v-col cols="12" md="7">
        <v-card rounded="xl">
          <v-card-title class="font-weight-bold">Лента уведомлений</v-card-title>
          <v-divider />
          <v-list v-if="notifications.length">
            <v-list-item v-for="item in notifications" :key="item.id" :class="{ 'note-unread': !item.read }">
              <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle class="mb-1">{{ syncLabel(item.kind) }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ item.text }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-medium-emphasis">Уведомлений пока нет.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
