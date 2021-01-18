<template>
  <div>
    <v-navigation-drawer
      dark
      v-model="drawer"
      absolute
      temporary
      style="position: fixed"
    >
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
      <google-auth />
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

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text to="/events">
          <v-icon class="ma-2">mdi-calendar</v-icon>
          Events
        </v-btn>
        <v-btn text to="/users">
          <v-icon class="ma-2">mdi-account-group</v-icon>
          Users
        </v-btn>
        <google-auth />
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import GoogleAuth from "@/components/GoogleAuth.vue";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: {
    GoogleAuth,
  },
})
export default class Header extends Vue {
  drawer: null | boolean = null;
  items: { title: string; icon: string; to: string }[] = [
    { title: "Home", icon: "mdi-home", to: "/" },
    { title: "Events", icon: "mdi-calendar", to: "/events" },
    { title: "Users", icon: "mdi-account-group", to: "/users" },
  ];
}
</script>

<style scoped>
.toolbar-title {
  color: white;
  text-decoration: none;
}
</style>
