<script setup>
  import AreaTitle from './AreaTitle.vue'

  const props = defineProps({
    currentDistTemp: {
      type: Object,
      default: () => ({})
    }
  })
</script>

<template>
  <AreaTitle title="空氣條件"/>
  <div class="row pl-2">
    <div class="col-6 mb-3">
      <i class="subTitle bi bi-thermometer-half"></i><span class="subTitle ml-3">體感溫度</span>
      <div class="air_content">{{ props.currentDistTemp.apparentTemperature }}&#8451;</div>
    </div>
    <div class="col-6 mb-3">
      <i class="subTitle bi bi-cloud-rain-fill"></i><span class="subTitle ml-3">降雨機率</span>
      <div class="air_content">{{ props.currentDistTemp.chanceOfRain }}%</div>
    </div>
    <div class="col-6">
      <i class="subTitle bi bi-wind"></i><span class="subTitle ml-3">風速</span>
      <div class="air_content">{{ props.currentDistTemp.windSpeed }}</div>
    </div>
    <div class="col-6">
      <i class="subTitle bi bi-signpost-split-fill"></i><span class="subTitle ml-3">風向</span>
      <div class="air_content">{{ props.currentDistTemp.windDirection }}</div>
    </div>
  </div>
</template>