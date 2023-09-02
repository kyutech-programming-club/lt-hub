<template>
  <v-app>
    <Header />
	<h1>App.vue</h1>
    <v-main fluid fill-height align-start>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import Header from '@/components/Header.vue'

  export default {
    components: {
      Header
    }
  }
</script>

<style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
