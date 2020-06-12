<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list class="pt-1" dense>
        <v-divider></v-divider>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dark clipped-left fixed app>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" class="toolbar-title">LT-Hub</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <github-auth />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text to="/events">
          <v-icon>mdi-presentation</v-icon>
          Events
        </v-btn>
        <v-btn text to="/users">
          <v-icon>mdi-account-group</v-icon>
          Users
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
  import GithubAuth from '@/components/GithubAuth.vue'

  export default {
    components: {
      GithubAuth
    },
    data() {
      return {
        drawer: null,
        items: [
          { title: 'Home', icon: 'mdi-home', to: '/' },
          { title: 'Events', icon: 'mdi-presentation', to: '/events' },
          { title: 'Users', icon: 'mdi-account-group', to: '/users' }
        ]
      };
    }
  }

</script>

<style scoped>
  .toolbar-title {
    color: white;
    text-decoration: none;
  }
</style>
