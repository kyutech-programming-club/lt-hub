<template>
  <v-app>
    <v-app-bar
      app
      dark
    >
      <v-toolbar-title>
        <router-link to="/" class="toolbar-title">LT-Hub</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <github-auth />
      <v-toolbar-items>
        <v-btn text to="/events">Events</v-btn>
        <v-btn text to="/users">Users</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content fluid fill-height align-start>
      <v-container>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import GithubAuth from '@/components/GithubAuth.vue'

export default {
  components: {
    GithubAuth
  }
}
</script>

<style scoped>
  .toolbar-title {
    color: white;
    text-decoration: none;
  }
</style>