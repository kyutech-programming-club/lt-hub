<template>
  <div id="app">
    <img alt="Vue logo" src="@/assets/logo.png">
    <github-auth msg="Welcome to LT-Hub"/>
  </div>
</template>

<script>
import GithubAuth from '@/components/GithubAuth.vue'

export default {
  components: {
    GithubAuth
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
