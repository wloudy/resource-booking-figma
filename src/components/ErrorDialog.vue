<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const open = computed({
  get: () => store.state.ui.errorDialog.open,
  set: (value) => {
    if (!value) store.dispatch('ui/closeErrorDialog')
  },
})

const title = computed(() => store.state.ui.errorDialog.title)
const message = computed(() => store.state.ui.errorDialog.message)

function close() {
  store.dispatch('ui/closeErrorDialog')
}
</script>

<template>
  <v-dialog v-model="open" max-width="520">
    <v-card rounded="xl" class="figma-modal">
      <v-card-title class="text-h3 text-center pt-8 pb-2">{{ title }}</v-card-title>
      <v-card-text class="text-center text-h6 pb-2">{{ message }}</v-card-text>
      <v-card-actions class="px-8 pb-8">
        <v-btn class="btn-green w-100" size="large" @click="close">Принять</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
