<template>
  <div>
    <app-header />
    <slot />
  </div>
</template>

<script setup>
import AppHeader from '@/layouts/AppHeader.vue'
// export default {
//   name: 'AppLayout',
//   components: {
//     AppHeader
//   }
// }
</script>

<style scoped>

</style>
