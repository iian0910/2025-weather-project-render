<template>
  <loading-overlay
    :active="loadingState.active"
    :is-full-page="true"
  />
</template>

<script setup>
import { loadingState } from '../stores/loadingStore'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
</script>
