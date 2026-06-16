<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const notifications = computed(() =>
  store.getters['notifications/all'].filter((item) => item.kind === 'booking_created').slice(0, 3),
)

function toDate(value) {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return null
  if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const monthLabel = computed(() => {
  const date = toDate(selectedDate.value) || new Date('2023-12-13')
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  }).format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
})

function decline(item) {
  store.dispatch('notifications/declineInvitation', item)
}

function details(item) {
  store.dispatch('ui/showSnackbar', {
    message: `Открыты детали: ${item.title}`,
    color: 'info',
  })
}
</script>

<template>
  <div class="sidebar-panel">
    <v-card rounded="lg" class="mb-4 sidebar-card">
      <v-card-title class="d-flex align-center justify-space-between py-3">
        <span class="text-subtitle-1">{{ monthLabel }}</span>
        <v-icon icon="mdi-chevron-right" />
      </v-card-title>
      <v-card-text class="pt-0">
        <v-date-picker
          v-model="selectedDate"
          hide-header
          show-adjacent-months
          locale="ru"
          :first-day-of-week="1"
          color="primary"
          class="figma-datepicker"
          elevation="0"
        />
      </v-card-text>
    </v-card>

    <v-card rounded="lg" class="sidebar-card">
      <v-card-title class="text-subtitle-1 py-3">Активные приглашения</v-card-title>
      <v-card-text>
        <transition-group name="fade-up" tag="div">
          <div v-for="item in notifications" :key="item.id" class="invite-card mb-4">
          <div class="text-body-2 mb-2">Съёмки в первомайском</div>
          <div class="d-flex ga-2 mb-2">
            <v-chip size="small" class="chip-soft">10.00 - 12.00</v-chip>
            <v-chip size="small" class="chip-soft">Иванов И. И.</v-chip>
            <v-chip size="small" class="chip-soft">Фотограф</v-chip>
          </div>
          <div class="d-flex ga-2">
            <v-btn size="small" class="btn-green" @click="details(item)">Подробнее</v-btn>
            <v-btn size="small" variant="tonal" @click="decline(item)">Отклонить</v-btn>
          </div>
        </div>
        </transition-group>
        <div v-if="!notifications.length" class="text-medium-emphasis text-body-2">Нет приглашений</div>
      </v-card-text>
    </v-card>
  </div>
</template>
