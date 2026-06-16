import { createVuetify } from 'vuetify'
import { ru } from 'vuetify/locale'

export default createVuetify({
  locale: {
    locale: 'ru',
    fallback: 'en',
    messages: { ru },
  },
  theme: {
    defaultTheme: 'bookingLight',
    themes: {
      bookingLight: {
        dark: false,
        colors: {
          background: '#f3f3f3',
          surface: '#ececec',
          primary: '#4d807a',
          secondary: '#dbe4e4',
          accent: '#10b981',
          error: '#ef4444',
          info: '#5a8f89',
          success: '#10b981',
          warning: '#f59e0b',
        },
      },
    },
  },
})
