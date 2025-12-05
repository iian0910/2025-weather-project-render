import { defineStore } from 'pinia'
import axios from 'axios'

import { useAlert } from '../composables/useAlert'
import { useLoading } from '@/composables/useLoading.js'

import _ from 'lodash'

const alert = useAlert()
const loading = useLoading()

const baseURL = import.meta.env.VITE_API_URL
const auth = import.meta.env.VITE_AUTH_CODE

const api = axios.create({
  baseURL
})

export const useWeatherStore = defineStore('weatherData', {
  state: () => ({
    dist3Day: {},
    dist7Day: {},
    currentObj: null,
    date: null
  }),

  actions: {
    clearDate() {
      this.date = null
      localStorage.removeItem('weatherData')
    },
    checkDailyReset() {
      const lastReset = localStorage.getItem('last_reset')
      const now = new Date()

      const today = now.toISOString().slice(0, 10)

      if (lastReset === today) return // 當天資料重置過就跳過

      const sixAM = new Date()
      sixAM.setHours(6,0,0,0)

      if(now >= sixAM) {
        this.clearDate()
        localStorage.setItem('last_reset', today)
      }
    },
    async fetchWeatherForecast(obj) {
      loading.show()

      this.currentObj = obj
      const isDataExit = localStorage.getItem('weatherData')

      if (isDataExit) {
        loading.hide()
        return { day3: _.pick(this.dist3Day, this.currentObj.key_3D), day7: _.pick(this.dist7Day, this.currentObj.key_7D) }
      } else {
        try {
          const urls = [
            `/${this.currentObj.key_3D}?Authorization=${auth}&format=JSON`,
            `/${this.currentObj.key_7D}?Authorization=${auth}&format=JSON`
          ]
  
          const [day3, day7] = await Promise.all(urls.map(url => api.get(url)))
  
          // 3 天資料
          if (day3.data.success) {
            this.dist3Day[this.currentObj.key_3D] = day3.data.records.Locations[0].Location
          } else {
            alert.danger('讀取 3 天資料失敗')
          }
  
          // 7 天資料
          if (day7.data.success) {
            this.dist7Day[this.currentObj.key_7D] = day7.data.records.Locations[0].Location
          } else {
            alert.danger('讀取 7 天資料失敗')
          }

        } catch (error) {
          alert.danger(error)
        } finally {
          loading.hide()
        }
      }
    }
  },

  persist: true
})