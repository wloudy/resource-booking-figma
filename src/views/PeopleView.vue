<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import SidebarPanel from '../components/SidebarPanel.vue'

const store = useStore()
const query = ref('')
const sort = ref('По алфавиту')

const basePeople = [
  { id: 'p1', name: 'Иван Иванов', gender: 'male', role: 'Фотограф', about: 'Высококачественная видеосъёмка и аэросъёмка, доступные цены, профессиональное оборудование и опыт.' },
  { id: 'p2', name: 'Анастасия Ремогузина', gender: 'female', role: 'Видео', about: 'Высококачественная видеосъёмка и аэросъёмка, доступные цены, профессиональное оборудование и опыт.' },
  { id: 'p3', name: 'Иван Иванов', gender: 'male', role: 'Фотограф', about: 'Высококачественная видеосъёмка и аэросъёмка, доступные цены, профессиональное оборудование и опыт.' },
  { id: 'p4', name: 'Анастасия Ремогузина', gender: 'female', role: 'Видео', about: 'Высококачественная видеосъёмка и аэросъёмка, доступные цены, профессиональное оборудование и опыт.' },
  { id: 'p5', name: 'Иван Иванов', gender: 'male', role: 'Фотограф', about: 'Высококачественная видеосъёмка и аэросъёмка, доступные цены, профессиональное оборудование и опыт.' },
  { id: 'p6', name: 'Анастасия Ремогузина', gender: 'female', role: 'Видео', about: 'Высококачественная видеосъёмка и аэросъёмка, доступные цены, профессиональное оборудование и опыт.' },
]

const people = computed(() => {
  const filtered = basePeople.filter((item) =>
    item.name.toLowerCase().includes(query.value.toLowerCase()),
  )
  if (sort.value === 'По алфавиту') {
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  }
  return filtered
})

function invite(person) {
  store.dispatch('notifications/createNotification', {
    title: `Приглашен специалист: ${person.name}`,
    text: 'Новый участник приглашен в мероприятие.',
    kind: 'booking_created',
  })
  store.dispatch('ui/showSnackbar', { message: `Приглашение отправлено: ${person.name}`, color: 'success' })
}

function openEventDialog() {
  store.dispatch('ui/openResourceDialog')
}
</script>

<template>
  <v-container fluid class="page-shell">
    <v-row>
      <v-col cols="12" lg="8">
        <v-card rounded="lg" class="people-toolbar mb-4">
          <v-card-text class="d-flex flex-wrap ga-3">
            <v-text-field
              v-model="query"
              density="compact"
              hide-details
              variant="solo-filled"
              placeholder="Поиск"
              prepend-inner-icon="mdi-magnify"
              class="toolbar-input"
            />
            <v-select
              v-model="sort"
              :items="['По алфавиту', 'Сначала новые']"
              density="compact"
              hide-details
              variant="solo-filled"
              class="toolbar-select"
            />
            <v-spacer />
            <v-btn class="btn-green" @click="openEventDialog">Добавить +</v-btn>
          </v-card-text>
        </v-card>

        <v-row>
          <v-col v-for="person in people" :key="person.id" cols="12" md="6">
            <v-card rounded="lg" class="person-card">
              <div class="person-row">
                <div class="person-photo-icon" :class="person.gender === 'male' ? 'gender-male' : 'gender-female'">
                  <v-icon :icon="person.gender === 'male' ? 'mdi-human-male' : 'mdi-human-female'" size="70" />
                </div>
                <div class="pa-3 flex-grow-1">
                  <h3 class="text-h6 mb-1">{{ person.name }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-3 person-about">{{ person.about }}</p>
                  <div class="d-flex ga-2 flex-wrap">
                    <v-chip size="small" class="chip-soft">{{ person.role }}</v-chip>
                    <v-btn size="small" class="btn-green" @click="invite(person)">Пригласить</v-btn>
                    <v-btn size="small" variant="tonal">Подробнее</v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="4">
        <SidebarPanel />
      </v-col>
    </v-row>
  </v-container>
</template>
