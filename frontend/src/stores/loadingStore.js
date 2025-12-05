import { ref } from "vue";

export const loadingState = ref({
  active: false
})

export const showLoading = () => {
  loadingState.value.active = true
}

export const hideLoading = () => {
  loadingState.value.active = false
}

export const withLoading = async(fn) => {
  try {
    showLoading()

    return await fn()
  } finally {
    hideLoading()
  }
}