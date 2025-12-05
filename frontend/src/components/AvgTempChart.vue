<!-- DATA: https://opendata.cwa.gov.tw/dist/opendata-swagger.html#/ -->
<script setup>
  import { defineProps, ref, watch } from 'vue'
  import { Line } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    lineTension: 0.3
  }

  // props
  const props = defineProps({
    tempData: {
      type: Array,
      default: () => ([])
    }
  })

  // data
  const chartData = ref({
    labels: [],
    datasets: [
      {
        label: '最高溫',
        backgroundColor: '#f87979',
        data: []
      },
      {
        label: '最低溫',
        backgroundColor: '#002050',
        data: []
      }
    ]
  })

  const chartDataKey = ref(0)

  // methods
  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const initChart = () => {
    const highMap = {} // date -> temperature (from even indices)
    const lowMap = {}  // date -> temperature (from odd indices)

    props.tempData.WeatherElement[0].Time.forEach((item, idx) => {
      const date = formatDate(item.StartTime)
      const temp = item.ElementValue?.[0]?.Temperature ?? null
      if (idx % 2 === 0) {
        // 假設基數是高溫
        highMap[date] = temp
      } else {
        // 偶數是低溫
        lowMap[date] = temp
      }
    })

    // 合併日期，並排序（升冪）
    const dates = Array.from(new Set([...Object.keys(highMap), ...Object.keys(lowMap)])).sort()
    const result =  dates.map(date => ({
      Date: date,
      HighTemperature: highMap[date] ?? null,
      LowTemperature: lowMap[date] ?? null
    }))

    reBuildChartData(result)
  }

  const reBuildChartData = (arrayData) => {
    const getDate = arrayData.map(item => item.Date)
    const getHighTemp = arrayData.map(item => item.HighTemperature)
    const getLowTemp = arrayData.map(item => item.LowTemperature)

    chartData.value.labels = getDate
    chartData.value.datasets[0].data = getHighTemp
    chartData.value.datasets[1].data = getLowTemp
    chartDataKey.value++
  }

  // watch
  watch(
    () => props.tempData,
    (val) => {
      if (val) {
        initChart()
      }
    },
    { immediate: true }
  )
</script>

<template>
  <div>
    <h1>{{ props.tempData.LocationName }}{{ props.tempData.WeatherElement[0].ElementName }}</h1>
    <Line :data="chartData" :options="options" :key="chartDataKey" v-if="chartData.labels.length"/>
  </div>
</template>
