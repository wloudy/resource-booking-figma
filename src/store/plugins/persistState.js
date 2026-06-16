const STORAGE_KEY = 'resource-booking-state-v1'

export default (store) => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed.resources)) {
        store.commit('resources/SET_RESOURCES', parsed.resources)
      }
      if (Array.isArray(parsed.bookings)) {
        store.commit('bookings/SET_BOOKINGS', parsed.bookings)
      }
      if (Array.isArray(parsed.notifications)) {
        store.commit('notifications/SET_NOTIFICATIONS', parsed.notifications)
      }
      if (typeof parsed.syncEnabled === 'boolean') {
        store.commit('notifications/SET_SYNC_ENABLED', parsed.syncEnabled)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  store.subscribe((_mutation, state) => {
    const payload = {
      resources: state.resources.resources,
      bookings: state.bookings.bookings,
      notifications: state.notifications.notifications,
      syncEnabled: state.notifications.syncEnabled,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  })
}
