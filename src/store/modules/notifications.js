const uid = () => `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`

export default {
  namespaced: true,

  state: () => ({
    notifications: [],
    syncEnabled: true,
  }),

  getters: {
    all: (state) => [...state.notifications],
    unreadCount: (state) => state.notifications.filter((item) => !item.read).length,
  },

  mutations: {
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications
    },
    ADD_NOTIFICATION(state, payload) {
      state.notifications.unshift(payload)
    },
    MARK_ALL_READ(state) {
      state.notifications = state.notifications.map((item) => ({ ...item, read: true }))
    },
    SET_SYNC_ENABLED(state, value) {
      state.syncEnabled = value
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter((item) => item.id !== id)
    },
  },

  actions: {
    createNotification({ commit, state }, payload) {
      const syncSuffix = state.syncEnabled ? 'Синхронизировано с календарями сотрудников.' : 'Синхронизация отключена.'
      commit('ADD_NOTIFICATION', {
        id: uid(),
        title: payload.title,
        text: `${payload.text} ${syncSuffix}`,
        kind: payload.kind,
        read: false,
        createdAt: new Date().toISOString(),
      })
    },
    markAllRead({ commit }) {
      commit('MARK_ALL_READ')
    },
    setSyncEnabled({ commit }, value) {
      commit('SET_SYNC_ENABLED', value)
    },
    declineInvitation({ commit, dispatch }, item) {
      commit('REMOVE_NOTIFICATION', item.id)
      dispatch(
        'ui/showSnackbar',
        {
          message: `Приглашение "${item.title}" отклонено.`,
          color: 'warning',
        },
        { root: true },
      )
    },
  },
}
