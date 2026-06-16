const initialResources = [
  {
    id: 'resource-1',
    name: 'Конференц-зал A',
    type: 'Конференц-зал',
    location: '3 этаж, блок B',
    manager: 'Анна Петрова',
    capacity: 12,
  },
  {
    id: 'resource-2',
    name: 'Фотограф Иван',
    type: 'Фотограф',
    location: 'Медиа-отдел',
    manager: 'Мария Смирнова',
    capacity: 1,
  },
  {
    id: 'resource-3',
    name: 'Проектор Epson X12',
    type: 'Оборудование',
    location: 'Склад техники',
    manager: 'Дмитрий Ковалев',
    capacity: 1,
  },
]

const uid = () => `resource-${Date.now()}-${Math.floor(Math.random() * 1000)}`

export default {
  namespaced: true,

  state: () => ({
    resources: initialResources,
  }),

  getters: {
    all: (state) => state.resources,
    byId: (state) => (id) => state.resources.find((item) => item.id === id) || null,
    count: (state) => state.resources.length,
  },

  mutations: {
    SET_RESOURCES(state, resources) {
      state.resources = resources
    },
    ADD_RESOURCE(state, payload) {
      state.resources.push(payload)
    },
    UPDATE_RESOURCE(state, payload) {
      const index = state.resources.findIndex((item) => item.id === payload.id)
      if (index !== -1) {
        state.resources.splice(index, 1, payload)
      }
    },
    REMOVE_RESOURCE(state, id) {
      state.resources = state.resources.filter((item) => item.id !== id)
    },
  },

  actions: {
    createResource({ commit }, payload) {
      commit('ADD_RESOURCE', { ...payload, id: uid() })
    },
    updateResource({ commit }, payload) {
      commit('UPDATE_RESOURCE', payload)
    },
    deleteResource({ commit }, id) {
      commit('REMOVE_RESOURCE', id)
    },
  },
}
