<script setup>
import { alerts } from '../stores/alertStore';
</script>

<template>
  <div class="global-alert-container">
    <div
      v-for="alert in alerts"
      :key="alert.id"
      :class="['alert', `alert-${alert.type}`, 'alert-dismissible', 'fade', 'show']"
      role="alert"
    >
      {{ alert.message }}
    </div>
  </div>
</template>

<style scoped>
.global-alert-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
