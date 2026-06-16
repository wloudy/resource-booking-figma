<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BookingFormDialog from '../components/BookingFormDialog.vue'
import ResourceFormDialog from '../components/ResourceFormDialog.vue'
import ErrorDialog from '../components/ErrorDialog.vue'
import { imageLinks } from '../data/imageLinks'
import { preloadImage } from '../utils/images'

const route = useRoute()
const router = useRouter()
const store = useStore()
const drawer = ref(false)
const profileMenuOpen = ref(false)
const navTrackRef = ref(null)
const navRefs = ref({})
const navIndicatorStyle = ref({
  width: '0px',
  transform: 'translateX(0px)',
  opacity: 0,
})
const fallbackTopbar = 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1200&q=80'
const topbarBg = ref(fallbackTopbar)

const topbarStyle = computed(() => ({
  '--topbar-bg-image': `url("${topbarBg.value}")`,
}))

const navTabs = [
  { key: 'apparatus', title: 'Аппаратура' },
  { key: 'people', title: 'Люди', routeName: 'people' },
  { key: 'space', title: 'Пространство', routeName: 'space' },
  { key: 'profile', title: 'Профиль' },
]

const activeNavKey = computed(() => {
  if (route.name === 'people') return 'people'
  if (route.name === 'space') return 'space'
  return ''
})

const bookingOpen = computed({
  get: () => store.state.ui.bookingDialogOpen,
  set: (value) => {
    if (value) store.dispatch('ui/openBookingDialog')
    else store.dispatch('ui/closeBookingDialog')
  },
})

const resourceOpen = computed({
  get: () => store.state.ui.resourceDialogOpen,
  set: (value) => {
    if (!value) store.dispatch('ui/closeResourceDialog')
  },
})

const snackbarVisible = computed({
  get: () => store.state.ui.snackbar.visible,
  set: (value) => {
    if (!value) store.dispatch('ui/hideSnackbar')
  },
})

const snackbarText = computed(() => store.state.ui.snackbar.message)
const snackbarColor = computed(() => store.state.ui.snackbar.color)

function closeDrawer() {
  drawer.value = false
}

function openBooking() {
  store.dispatch('ui/openBookingDialog')
}

function openResource() {
  store.dispatch('ui/openResourceDialog')
}

function openProfileMenu() {
  profileMenuOpen.value = true
}

function setNavRef(key, el) {
  if (el) navRefs.value[key] = el
}

function updateIndicator() {
  const key = activeNavKey.value
  const container = navTrackRef.value
  const active = navRefs.value[key]
  if (!container || !active || !key) {
    navIndicatorStyle.value = {
      width: '0px',
      transform: 'translateX(0px)',
      opacity: 0,
    }
    return
  }
  const containerRect = container.getBoundingClientRect()
  const activeRect = active.getBoundingClientRect()
  navIndicatorStyle.value = {
    width: `${activeRect.width}px`,
    transform: `translateX(${activeRect.left - containerRect.left}px)`,
    opacity: 1,
  }
}

function onNavClick(tab) {
  if (tab.key === 'apparatus') {
    openResource()
    return
  }
  if (tab.key === 'profile') {
    openProfileMenu()
    return
  }
  if (tab.routeName) {
    router.push({ name: tab.routeName })
  }
}

function handleResize() {
  updateIndicator()
}

onMounted(() => {
  preloadImage(imageLinks.topbarBackground, fallbackTopbar, (value) => {
    topbarBg.value = value
  })
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(
  () => route.name,
  async () => {
    await nextTick()
    updateIndicator()
  },
  { immediate: true },
)
</script>

<template>
  <v-app-bar flat color="#17191d" class="topbar" :style="topbarStyle">
    <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />

    <v-btn icon variant="text" :to="{ name: 'space' }" class="ms-2">
      <v-icon icon="mdi-pencil-box-outline" size="28" />
    </v-btn>

    <v-spacer />

    <div ref="navTrackRef" class="d-none d-md-flex top-nav-track">
      <v-btn
        v-for="tab in navTabs"
        :key="tab.key"
        :ref="(el) => setNavRef(tab.key, el ? el.$el ?? el : null)"
        variant="text"
        class="nav-item nav-tab-btn"
        :class="{ 'nav-item-active': activeNavKey === tab.key }"
        @click="onNavClick(tab)"
      >
        {{ tab.title }}
      </v-btn>
      <span class="nav-active-indicator" :style="navIndicatorStyle" />
    </div>

    <v-menu v-model="profileMenuOpen" location="bottom end">
      <template #activator="{ props }">
        <v-btn icon variant="text" class="me-2" v-bind="props">
          <v-icon icon="mdi-account-circle" size="34" />
        </v-btn>
      </template>
      <v-card rounded="lg" min-width="180">
        <v-card-text class="text-body-2">
          <div class="font-weight-bold mb-1">Иван Иванов</div>
          <div class="text-medium-emphasis mb-3">example@yandex.ru</div>
          <v-btn block color="primary" size="small" @click="router.push({ name: 'auth' })">Выход</v-btn>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-btn
      class="d-none d-sm-inline-flex me-2"
      color="primary"
      variant="flat"
      @click="openResource()"
    >
      Добавить +
    </v-btn>

    <v-btn color="white" variant="outlined" prepend-icon="mdi-calendar-plus" @click="openBooking()">Забронировать</v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list nav>
      <v-list-item
        v-for="tab in navTabs"
        :key="tab.key"
        :title="tab.title"
        :to="tab.routeName ? { name: tab.routeName } : undefined"
        :active="tab.routeName ? route.name === tab.routeName : false"
        @click="tab.key === 'apparatus' ? (openResource(), closeDrawer()) : tab.key === 'profile' ? (openProfileMenu(), closeDrawer()) : closeDrawer()"
      />
      <v-divider class="my-2" />
      <v-list-item prepend-icon="mdi-plus-circle-outline" title="Новый ресурс" @click="openResource(); closeDrawer()" />
      <v-list-item prepend-icon="mdi-calendar-plus" title="Новое бронирование" @click="openBooking(); closeDrawer()" />
      <v-list-item prepend-icon="mdi-account-circle-outline" title="Профиль" @click="closeDrawer" />
    </v-list>
  </v-navigation-drawer>

  <v-main class="app-main">
    <RouterView />
  </v-main>

  <BookingFormDialog v-model="bookingOpen" />
  <ResourceFormDialog v-model="resourceOpen" />
  <ErrorDialog />

  <v-snackbar
    v-model="snackbarVisible"
    :color="snackbarColor"
    :timeout="5000"
    location="top"
  >
    {{ snackbarText }}
    <template #actions>
      <v-btn variant="text" @click="store.dispatch('ui/hideSnackbar')">OK</v-btn>
    </template>
  </v-snackbar>
</template>
