<script setup>
import { computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'

defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])
const store = useStore()

const editingResource = computed(() => store.state.ui.editingResource)

const form = reactive({
  id: null,
  name: '',
  type: '',
  location: '',
  manager: '',
  capacity: 1,
})

watch(
  editingResource,
  (value) => {
    if (!value) {
      form.id = null
      form.name = ''
      form.type = ''
      form.location = ''
      form.manager = ''
      form.capacity = 1
      return
    }
    form.id = value.id
    form.name = value.name
    form.type = value.type
    form.location = value.location
    form.manager = value.manager
    form.capacity = value.capacity
  },
  { immediate: true },
)

const dialogTitle = computed(() => (form.id ? 'Редактирование мероприятия' : 'Новое мероприятие'))

function close() {
  emit('update:modelValue', false)
  store.dispatch('ui/closeResourceDialog')
}

function submit() {
  const payload = {
    id: form.id,
    name: form.name.trim(),
    type: form.type.trim(),
    location: form.location.trim(),
    manager: form.manager.trim(),
    capacity: Number(form.capacity) || 1,
  }

  if (!payload.name || !payload.type || !payload.manager) {
    store.dispatch('ui/showSnackbar', {
      message: 'Заполни название, тип и ответственного.',
      color: 'error',
    })
    return
  }

  if (payload.id) {
    store.dispatch('resources/updateResource', payload)
    store.dispatch('ui/showSnackbar', { message: 'Ресурс обновлен.', color: 'success' })
  } else {
    store.dispatch('resources/createResource', payload)
    store.dispatch('ui/showSnackbar', { message: 'Ресурс добавлен.', color: 'success' })
  }
  close()
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="760" @update:model-value="!$event && close()">
    <v-card rounded="xl" class="figma-modal">
      <v-card-title class="px-8 pt-8 pb-2">
        <span class="text-h4 font-weight-medium">{{ dialogTitle }}</span>
      </v-card-title>
      <v-card-text class="px-8 pb-4">
        <v-text-field v-model="form.name" label="Название" placeholder="Введите название мероприятия" variant="underlined" class="mb-2" />
        <div class="text-body-2 mb-3">Выберите время мероприятия</div>
        <div class="slots-modal-grid mb-4">
          <button type="button" class="slot-custom">08.00 - 09.00</button>
          <button type="button" class="slot-custom">09.00 - 10.00</button>
          <button type="button" class="slot-custom">10.00 - 11.00</button>
          <button type="button" class="slot-custom">11.00 - 12.00</button>
          <button type="button" class="slot-custom">12.00 - 13.00</button>
          <button type="button" class="slot-custom">13.00 - 14.00</button>
          <button type="button" class="slot-custom">14.00 - 15.00</button>
          <button type="button" class="slot-custom">15.00 - 16.00</button>
          <button type="button" class="slot-custom">16.00 - 17.00</button>
          <button type="button" class="slot-custom">17.00 - 18.00</button>
          <button type="button" class="slot-custom">18.00 - 19.00</button>
          <button type="button" class="slot-custom">19.00 - 20.00</button>
        </div>
        <div class="text-body-2 mb-2">Ответственные лица</div>
        <div class="d-flex flex-wrap align-center ga-2 mb-3">
          <v-chip class="chip-soft chip-soft-active">Иван Иванов</v-chip>
          <v-chip class="chip-soft chip-soft-active">Елена Иванова</v-chip>
          <v-btn icon="mdi-plus" variant="text" size="small" />
        </div>
        <v-text-field
          v-model="form.type"
          label="Дополнительная информация"
          placeholder="Добавить комментарий"
          variant="underlined"
          class="mb-2"
        />
        <v-text-field
          v-model="form.location"
          label="Локация"
          variant="underlined"
          class="mb-3"
        />
        <v-text-field v-model="form.manager" label="Ответственный" variant="underlined" class="mb-3" />
        <v-text-field v-model="form.capacity" type="number" label="Вместимость" variant="underlined" min="1" />
      </v-card-text>
      <v-card-actions class="px-8 pb-8">
        <v-btn class="btn-green flex-grow-1" size="large" @click="submit">Забронировать</v-btn>
        <v-btn variant="tonal" class="flex-grow-0 ms-2 px-8" size="large" @click="close">Отмена</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
