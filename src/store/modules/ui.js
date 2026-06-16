export default {
  namespaced: true,

  state: () => ({
    bookingDialogOpen: false,
    resourceDialogOpen: false,
    editingResource: null,
    errorDialog: {
      open: false,
      title: 'Ошибка',
      message: '',
    },
    snackbar: {
      visible: false,
      message: '',
      color: 'success',
    },
  }),

  mutations: {
    SET_BOOKING_DIALOG(state, open) {
      state.bookingDialogOpen = open
    },
    SET_RESOURCE_DIALOG(state, open) {
      state.resourceDialogOpen = open
    },
    SET_EDITING_RESOURCE(state, resource) {
      state.editingResource = resource
    },
    SET_ERROR_DIALOG(state, payload) {
      state.errorDialog = payload
    },

    SHOW_SNACKBAR(state, { message, color = 'success' }) {
      state.snackbar = { visible: true, message, color }
    },

    HIDE_SNACKBAR(state) {
      state.snackbar.visible = false
    },
  },

  actions: {
    openBookingDialog({ commit }) {
      commit('SET_BOOKING_DIALOG', true)
    },

    closeBookingDialog({ commit }) {
      commit('SET_BOOKING_DIALOG', false)
    },

    openResourceDialog({ commit }, resource = null) {
      commit('SET_EDITING_RESOURCE', resource)
      commit('SET_RESOURCE_DIALOG', true)
    },

    closeResourceDialog({ commit }) {
      commit('SET_RESOURCE_DIALOG', false)
      commit('SET_EDITING_RESOURCE', null)
    },
    openErrorDialog({ commit }, { title = 'Ошибка', message }) {
      commit('SET_ERROR_DIALOG', {
        open: true,
        title,
        message,
      })
    },
    closeErrorDialog({ commit }) {
      commit('SET_ERROR_DIALOG', {
        open: false,
        title: 'Ошибка',
        message: '',
      })
    },

    showSnackbar({ commit }, payload) {
      commit('SHOW_SNACKBAR', payload)
    },

    hideSnackbar({ commit }) {
      commit('HIDE_SNACKBAR')
    },
  },
}
