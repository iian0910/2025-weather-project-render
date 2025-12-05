<script setup>

  const props = defineProps({
    title: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h6 class="title">{{props.title}}</h6>
    <slot/>
  </div>
</template>