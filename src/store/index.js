import { createStore } from 'vuex'
import bookings from './modules/bookings'
import resources from './modules/resources'
import notifications from './modules/notifications'
import ui from './modules/ui'
import persistState from './plugins/persistState'

export default createStore({
  modules: {
    bookings,
    resources,
    notifications,
    ui,
  },
  plugins: [persistState],
})
