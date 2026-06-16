const pad = (value) => `${value}`.padStart(2, '0')

const now = new Date()
const sampleDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate() + 1)}`

const initialBookings = [
  {
    id: 'booking-1',
    resourceId: 'resource-1',
    resourceName: 'Конференц-зал A',
    date: sampleDate,
    startTime: '10:00',
    endTime: '11:30',
    purpose: 'Планирование квартала',
    participants: ['Иван Сидоров', 'Анна Петрова'],
    createdBy: 'Менеджер продукта',
    createdAt: new Date().toISOString(),
  },
]

const uid = () => `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`

function toMinutes(value) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function intersects(left, right) {
  if (left.date !== right.date || left.resourceId !== right.resourceId) return false
  const leftStart = toMinutes(left.startTime)
  const leftEnd = toMinutes(left.endTime)
  const rightStart = toMinutes(right.startTime)
  const rightEnd = toMinutes(right.endTime)
  return leftStart < rightEnd && leftEnd > rightStart
}

export default {
  namespaced: true,

  state: () => ({
    bookings: initialBookings,
  }),

  getters: {
    all: (state) => [...state.bookings].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)),
    byDate: (state) => (date) =>
      [...state.bookings]
        .filter((item) => item.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    byResourceAndDate: (state) => (resourceId, date) =>
      [...state.bookings]
        .filter((item) => item.resourceId === resourceId && item.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    count: (state) => state.bookings.length,
  },

  mutations: {
    SET_BOOKINGS(state, bookings) {
      state.bookings = bookings
    },
    ADD_BOOKING(state, booking) {
      state.bookings.push(booking)
    },
    DELETE_BOOKING(state, id) {
      state.bookings = state.bookings.filter((item) => item.id !== id)
    },
    DELETE_BY_RESOURCE(state, resourceId) {
      state.bookings = state.bookings.filter((item) => item.resourceId !== resourceId)
    },
  },

  actions: {
    createBooking({ commit, state, dispatch, rootGetters }, payload) {
      const resource = rootGetters['resources/byId'](payload.resourceId)
      if (!resource) {
        return { ok: false, message: 'Выбранный ресурс не найден.' }
      }

      if (!payload.date || !payload.startTime || !payload.endTime) {
        return { ok: false, message: 'Укажи дату и временной интервал бронирования.' }
      }

      if (toMinutes(payload.endTime) <= toMinutes(payload.startTime)) {
        return { ok: false, message: 'Время окончания должно быть позже времени начала.' }
      }

      const conflict = state.bookings.find((item) => intersects(item, payload))
      if (conflict) {
        return {
          ok: false,
          message: `Конфликт с бронированием ${conflict.startTime}-${conflict.endTime} для ресурса "${resource.name}".`,
        }
      }

      const booking = {
        ...payload,
        id: uid(),
        resourceName: resource.name,
        createdAt: new Date().toISOString(),
      }
      commit('ADD_BOOKING', booking)

      const participantList = booking.participants.length
        ? booking.participants.join(', ')
        : 'без участников'

      dispatch(
        'notifications/createNotification',
        {
          title: 'Новое бронирование',
          text: `${booking.resourceName}: ${booking.date}, ${booking.startTime}-${booking.endTime}. Участники: ${participantList}.`,
          kind: 'booking_created',
        },
        { root: true },
      )

      dispatch(
        'ui/showSnackbar',
        {
          message: 'Бронирование создано и отправлено участникам.',
          color: 'success',
        },
        { root: true },
      )

      return { ok: true, booking }
    },

    deleteBooking({ commit, dispatch }, booking) {
      commit('DELETE_BOOKING', booking.id)
      dispatch(
        'notifications/createNotification',
        {
          title: 'Бронирование отменено',
          text: `${booking.resourceName}: ${booking.date}, ${booking.startTime}-${booking.endTime}.`,
          kind: 'booking_cancelled',
        },
        { root: true },
      )
    },

    deleteBookingsByResource({ commit }, resourceId) {
      commit('DELETE_BY_RESOURCE', resourceId)
    },
  },
}
