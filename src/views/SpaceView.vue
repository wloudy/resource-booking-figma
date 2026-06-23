<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import SidebarPanel from '../components/SidebarPanel.vue'
import { imageLinks } from '../data/imageLinks'
import { resolveImageUrl } from '../utils/images'

const store = useStore()
const fallbackSpaces = [
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
]
const imageErrors = ref({})

const slots = [
  '08.00 - 09.00',
  '09.00 - 10.00',
  '10.00 - 11.00',
  '11.00 - 12.00',
  '12.00 - 13.00',
  '13.00 - 14.00',
  '14.00 - 15.00',
  '15.00 - 16.00',
  '16.00 - 17.00',
  '17.00 - 18.00',
  '18.00 - 19.00',
  '19.00 - 20.00',
]

const displaySpaces = computed(() => [
  {
    id: 'space-1',
    name: 'Коворкинг ИРНИТУ',
    imageUrl: resolveImageUrl(imageLinks.spaces[0], fallbackSpaces[0]),
  },
  {
    id: 'space-2',
    name: 'Переговорная ИРНИТУ',
    imageUrl: resolveImageUrl(imageLinks.spaces[1], fallbackSpaces[1]),
  },
])

function bookFromCard(resource) {
  store.dispatch('ui/openBookingDialog')
  store.dispatch('ui/showSnackbar', {
    message: `Открыта форма бронирования для "${resource.name}"`,
    color: 'success',
  })
}

function onImageError(resourceId, fallback) {
  imageErrors.value = {
    ...imageErrors.value,
    [resourceId]: fallback,
  }
}

function imageFor(item, index) {
  return imageErrors.value[item.id] || resolveImageUrl(
    item.imageUrl,
    fallbackSpaces[index % fallbackSpaces.length],
  )
}
</script>

<template>
  <v-container fluid class="page-shell">
    <v-row>
      <v-col cols="12" lg="8">
        <v-card v-for="(item, index) in displaySpaces" :key="item.id" class="space-card mb-6" rounded="lg">
          <div class="space-preview">
            <img
              class="space-image-tag"
              :src="imageFor(item, index)"
              :alt="item.name"
              @error="onImageError(item.id, fallbackSpaces[index % fallbackSpaces.length])"
            >
            <div class="d-flex ga-2 pa-3">
              <v-chip size="small" class="photo-chip">Фото</v-chip>
              <v-chip size="small" class="photo-chip">Информация</v-chip>
            </div>
            <v-chip class="name-chip">{{ item.name }}</v-chip>
          </div>

          <div class="slots-grid pa-3">
            <v-btn
              v-for="(slot, idx) in slots"
              :key="slot"
              size="small"
              :class="[
                slot === '14.00 - 15.00' ? 'slot-btn action-btn action-book' : 'slot-btn',
                { active: idx === 2 || idx === 5 },
              ]"
              @click="slot === '14.00 - 15.00' ? bookFromCard(item) : null"
            >
              {{ slot === '14.00 - 15.00' ? 'Забронировать' : slot }}
            </v-btn>
            <v-btn class="slot-btn action-btn">14.00 - 15.00</v-btn>
            <v-btn class="slot-btn action-btn action-more">Подробнее</v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <SidebarPanel />
      </v-col>
    </v-row>
  </v-container>
</template>
