<script setup>
  import weatherIcon from '@/assets/js/weatherImg'

  const props = defineProps({
    selectedDist: {
      type: String,
      default: ''
    },
    currentDistTemp: {
      type: Object,
      default: () => ({})
    },
  })
</script>

<template>
  <div class="d-flex justify-content-between">
    <div>
      <div class="mb-3">
        <h3>{{ props.selectedDist }}</h3>
        <h6 class="subTitle">降雨機率：{{ props.currentDistTemp.chanceOfRain }}%</h6>
      </div>
      <div class="main_temp">
        {{ props.currentDistTemp.temperature }}&#8451;
      </div>
    </div>
    <img :src="weatherIcon[`icon${props.currentDistTemp.weatherCode}`]" width="130px" alt="">
  </div>
</template>