import { createI18n } from 'vue-i18n'
import enUS from '../locales/en-US'
import zhCN from '../locales/zh-CN'

const i18n = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: 'zh-CN', // set locale
  fallbackLocale: 'en-US', // set fallback locale
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN
  }
})

export default i18n
