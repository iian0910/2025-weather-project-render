<!-- DATA: https://opendata.cwa.gov.tw/dist/opendata-swagger.html#/ -->
<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { city } from '@/assets/js/location'
  // import AvgTempChart from './components/AvgTempChart.vue'
  import { useWeatherStore } from '@/stores/index'
  import { formatTheTimeString } from '@/assets/js/common'

  import SingleDistWeather from './components/SingleDistWeather.vue';
  import Forecast3HR from './components/Forecast3HR.vue';
  import ForecastWeekly from './components/ForecastWeekly.vue';
  import AirConditions from './components/AirConditions.vue';

  import _ from 'lodash'

  const store = useWeatherStore()

  // DATA
  const selectedDist = ref('')

  const currentDistTemp = ref({})
  const selectedCity = ref({key_3D: 'F-D0047-061', key_7D: 'F-D0047-063', value: '臺北市'})

  const distSelectorItem = ref([])
  const todayForecast = ref([])
  const next7DayForecast = ref([])
  const renderWeatherInfo = ref([])

  const isMorning = ref(true)

  // METHODS
  const fetchWeatherForecast = async(obj) => {
    // 從 store 發送 3 日跟 7 日的預報 API 並回傳
    // 從 store 整理行政區的下拉選項並回傳
    await store.fetchWeatherForecast(obj)

    const districtData = _.pick(store.dist3Day, obj.key_3D)
    distSelectorItem.value = districtData[obj.key_3D].map(item => item.LocationName)
    selectedDist.value = distSelectorItem.value[0] // 鄉鎮預設選第一個項目

    getWeatherInfo(selectedDist.value)
  }

  const findLatestItem = (list, timeKey = "DataTime") => {
    const now = Date.now(); // 毫秒數效率較高
    let result = null
    let minDiff = Infinity

    for (const item of list) {
      const itemTime = new Date(item[timeKey]).getTime();

      // 若時間晚於現在，直接跳過
      if (itemTime > now) continue;

      const diff = now - itemTime; // 距離現在的差距（越小越接近）

      if (diff < minDiff) {
        minDiff = diff;
        result = item;
      }
    }

    return result
  }

  const dataEvery3HR = (weather, temp) => {
    const result = weather.Time
      .map(mapItem => {
        const startKey = mapItem.StartTime.slice(0, 13)
        const tmpItem = temp.Time.find(t => t.DataTime.slice(0, 13) === startKey)

        return {
          StartTime: formatTheTimeString(mapItem.StartTime),
          ElementValue: [
            {
              Temperature: tmpItem?.ElementValue?.[0]?.Temperature ?? null,
              Weather: mapItem.ElementValue[0].Weather,
              WeatherCode: mapItem.ElementValue[0].WeatherCode
            }
          ]
        }
      })

    todayForecast.value = result.slice(0, 6)
  } 

  const fusion3DayWeatherInfo = (weatherObj) => {
    const mapping = [
      { idx: 0, key: 'temperature', field: 'Temperature' }, // 溫度
      { idx: 3, key: "apparentTemperature", field: "ApparentTemperature" }, // 體感溫度
      { idx: 5, key: "windSpeed", field: "WindSpeed" }, // 風速
      { idx: 6, key: "windDirection", field: "WindDirection" }, // 風向
      { idx: 7, key: "chanceOfRain", field: "ProbabilityOfPrecipitation", useStart: true }, // 3小時降雨機率
      { idx: 8, key: "weatherCode", field: "WeatherCode", useStart: true } // 天氣現象(天氣icon)
    ]
    mapping.forEach(({idx, key, field, useStart}) => {
      const element = weatherObj.WeatherElement[idx]
      const item = findLatestItem(element.Time, useStart ? 'StartTime': undefined)
      currentDistTemp.value[key] = item?.ElementValue?.[0]?.[field] ?? null
    })
  }

  const fusion7DayWeatherInfo = (weatherObj) => {
    const result = []
    const avgTemp = weatherObj.WeatherElement[0].Time
    const weather = weatherObj.WeatherElement[12].Time

    avgTemp.forEach((item, index) => {
      const date = item.StartTime.slice(0, 10)
      const hour = parseInt(item.StartTime.slice(11, 13))

      const weatherItem = weather[index]
      const weatherCode = weatherItem?.ElementValue?.[0]?.WeatherCode ?? null

      let dayItem = result.find(item => item.Date === date)

      if (!dayItem) {
        dayItem = {
          Date: date,
          Day: [
            {
              Temperature: null,
              WeatherCode: null
            }
          ],
          Night: [
            {
              Temperature: null,
              WeatherCode: null
            }
          ]
        }
        result.push(dayItem)
      }
      
      const temp = item.ElementValue[0].Temperature;
  
      if (hour === 6 || hour === 12) {
        dayItem.Day[0].Temperature = temp
        dayItem.Day[0].WeatherCode = weatherCode
      } else if (hour === 18) {
        dayItem.Night[0].Temperature = temp
        dayItem.Night[0].WeatherCode = weatherCode
      }
    })

    next7DayForecast.value = result
    renderWeatherInfo.value = next7DayForecast.value
  }

  const getWeatherInfo = (dist) => {
    const weatherObj3Day = store.dist3Day[selectedCity.value.key_3D].find(item => item.LocationName === dist)
    const weatherObj7Day = store.dist7Day[selectedCity.value.key_7D].find(item => item.LocationName === dist)

    fusion3DayWeatherInfo(weatherObj3Day)
    fusion7DayWeatherInfo(weatherObj7Day)
    dataEvery3HR(weatherObj3Day.WeatherElement[8], weatherObj3Day.WeatherElement[0])
  }

  // WATCH
  watch(
    () => selectedCity.value,
    (obj) => {
      isMorning.value = true
      if (obj) {
        fetchWeatherForecast(obj)
      }
    }, {deep: true}
  )

  watch(
    () => selectedDist.value,
    (dist) => {
      isMorning.value = true
      if (dist) {
        getWeatherInfo(dist)
      }
    }, {deep: true}
  )

  watch(
    () => isMorning.value,
    () => {
      renderWeatherInfo.value = next7DayForecast.value
    }, {immediate: true}
  )

  // MOUNTED
  onMounted(() => {
    fetchWeatherForecast(selectedCity.value)
  })

  // CREATE
  store.checkDailyReset()
</script>

<template>
  <div class="weather_bg min-vh-100">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-8 my-3">
          <div class="row">
            <div class="col-12">
              <div class="d-flex">
                <select
                  class="form-control mx-1 selector"
                  id="city_selector"
                  v-model="selectedCity"
                >
                  <option value="null" disabled selected>選擇縣市</option>
                  <option
                    v-for="location in city"
                    :value="location"
                    :key="location.key"
                  >
                    {{location.value}}
                  </option>
                </select>
                <select
                  class="form-control mx-1 selector"
                  id="dir_selector"
                  v-model="selectedDist"
                >
                  <option value="null" disabled selected>選擇行政區</option>
                  <option
                    v-for="(dist, idx) in distSelectorItem"
                    :key="idx"
                  >
                    {{dist}}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="dist_weather">
                <SingleDistWeather
                  :selectedDist="selectedDist"
                  :currentDistTemp="currentDistTemp"
                />
              </div>
              <div class="dist_weather">
                <Forecast3HR :todayForecast="todayForecast"/>
              </div>
              <div class="dist_weather">
                <AirConditions :currentDistTemp="currentDistTemp"/>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4 my-3">
          <div class="city_weather">
            <ForecastWeekly
              v-model:is-morning="isMorning"
              :renderWeatherInfo="renderWeatherInfo"
            />
          </div>
        </div>
      </div>
      
      <!-- <AvgTempChart
        :temp-data="weatherInfo"
      />-->
      
    </div>
  </div>
</template>
