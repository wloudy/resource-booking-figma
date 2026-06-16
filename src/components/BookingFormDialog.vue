<script setup>
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'

defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])
const store = useStore()

const resources = computed(() => store.getters['resources/all'])
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
const persons = ['Иван Иванов', 'Елена Иванова', 'Мария Смирнова']

const form = reactive({
  resourceId: '',
  slot: '10.00 - 11.00',
  purpose: '',
  participants: ['Иван Иванов', 'Елена Иванова'],
  createdBy: 'Текущий сотрудник',
})

const resourceItems = computed(() =>
  resources.value.map((item) => ({
    title: `${item.name} (${item.type})`,
    value: item.id,
  })),
)

function resetForm() {
  form.resourceId = ''
  form.slot = '10.00 - 11.00'
  form.purpose = ''
  form.participants = ['Иван Иванов', 'Елена Иванова']
  form.createdBy = 'Текущий сотрудник'
}

function close() {
  emit('update:modelValue', false)
  store.dispatch('ui/closeBookingDialog')
}

function submit() {
  const [startRaw, endRaw] = form.slot.split(' - ')
  const startTime = startRaw.replace('.', ':')
  const endTime = endRaw.replace('.', ':')
  const today = new Date().toISOString().slice(0, 10)

  const result = store.dispatch('bookings/createBooking', {
    resourceId: form.resourceId,
    date: today,
    startTime,
    endTime,
    purpose: form.purpose.trim() || 'Без описания',
    participants: form.participants,
    createdBy: form.createdBy.trim() || 'Неизвестный сотрудник',
  })

  Promise.resolve(result).then((payload) => {
    if (!payload.ok) {
      store.dispatch('ui/openErrorDialog', {
        title: 'Ошибка',
        message: payload.message || 'Неверный запрос. Обратитесь в техподдержку',
      })
      return
    }
    resetForm()
    close()
  })
}

function togglePerson(person) {
  if (form.participants.includes(person)) {
    form.participants = form.participants.filter((item) => item !== person)
    return
  }
  form.participants = [...form.participants, person]
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="760" @update:model-value="!$event && close()">
    <v-card rounded="xl" class="figma-modal">
      <v-card-title class="d-flex justify-space-between align-center px-8 pt-8 pb-2">
        <span class="text-h4 font-weight-medium">Бронирование</span>
        <v-btn icon="mdi-close" variant="text" color="black" @click="close" />
      </v-card-title>

      <v-card-text class="px-8 pb-4">
        <v-select
          v-model="form.resourceId"
          :items="resourceItems"
          label="Мероприятие"
          variant="underlined"
          placeholder="Выберите мероприятие"
          class="mb-4"
        />
        <div class="text-body-2 mb-3">Выберите время мероприятия</div>
        <div class="slots-modal-grid mb-4">
          <button
            v-for="slot in slots"
            :key="slot"
            type="button"
            class="slot-custom"
            :class="{ active: form.slot === slot }"
            @click="form.slot = slot"
          >
            {{ slot }}
          </button>
        </div>
        <div class="text-body-2 mb-2">Ответственные лица</div>
        <div class="d-flex flex-wrap align-center ga-2 mb-4">
          <v-chip
            v-for="person in persons"
            :key="person"
            class="chip-soft"
            :class="{ 'chip-soft-active': form.participants.includes(person) }"
            @click="togglePerson(person)"
          >
            {{ person }}
          </v-chip>
          <v-btn icon="mdi-plus" variant="text" size="small" />
        </div>
        <v-text-field
          v-model="form.purpose"
          label="Дополнительная информация"
          placeholder="Добавить комментарий"
          variant="underlined"
        />
      </v-card-text>

      <v-card-actions class="px-8 pb-8">
        <v-btn class="btn-green flex-grow-1" size="large" @click="submit">Забронировать</v-btn>
        <v-btn variant="tonal" class="flex-grow-0 ms-2 px-8" size="large" @click="close">Отмена</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
