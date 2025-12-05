<script setup>
  import { computed } from 'vue';
  import AreaTitle from './AreaTitle.vue'
  import weatherIcon from '@/assets/js/weatherImg'

  const props = defineProps({
    isMorning: {
      type: Boolean,
      default: true
    },
    renderWeatherInfo: {
      type: Array,
      default: () => {[]}
    }
  })

  const emit = defineEmits(['update:isMorning'])

  const model = computed({
    get: () => props.isMorning,
    set: (value) => {
      emit('update:isMorning', value)
    }
  })
</script>

<template>
  <AreaTitle title="一周預報">
    <div class="custom-control custom-switch">
      <input
        type="checkbox"
        class="custom-control-input"
        id="customSwitch1"
        v-model="model"
      >
      <label class="custom-control-label" for="customSwitch1">{{model ? '早上' : '夜晚'}}</label>
    </div>
  </AreaTitle>
  <div class="next7DayForecast d-flex justify-content-between align-items-center" v-for="item in props.renderWeatherInfo" :key="item.Date">
    <div class="subTitle">{{ item.Date }}</div>
    <div class="d-flex align-items-center">
      <img class="mr-3" :src="weatherIcon[`icon${model ? '' : 'Night'}${item[model ? 'Day' : 'Night'][0].WeatherCode}`]" alt="" width="50px" height="50px">
      <div>{{item[model ? 'Day' : 'Night'][0].Temperature}}&#8451;</div>
    </div>
  </div>
</template>