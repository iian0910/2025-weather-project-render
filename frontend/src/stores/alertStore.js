import { ref } from 'vue'

const alerts = ref([])
let nextId = 1

export const showAlert = (message, type = 'primary', duration = 3000) => {
  const id = nextId++;
  alerts.value.push({ id, message, type });

  if (duration > 0) {
    setTimeout(() => closeAlert(id), duration);
  }
}

export const closeAlert = (id) => {
  const index = alerts.value.findIndex(a => a.id === id);
  if (index !== -1) alerts.value.splice(index, 1);
}

export { alerts }