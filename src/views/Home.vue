<template>
  <div id="app">
    <h1>Welcome to LT-Hub!</h1>
    <backup></backup>
    <v-img alt="Vue logo" src="@/assets/logo.png" />
  </div>
</template>

<script>
  import Backup from '@/components/Backup.vue'
  export default {
    name: 'Home.vue',
    components: {
      Backup,
    }
  }
</script>

<style scoped>
</style>
