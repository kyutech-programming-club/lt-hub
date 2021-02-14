<template>
  <div class="logout-button">
    <v-avatar>
      <img :src="this.user.photoUrl" />
    </v-avatar>
    <v-btn
      class="ma-2"
      style="text-transform: none"
      color="white"
      @click="doLogout"
      outlined
      dark
    >
      <v-icon dark left>mdi-logout</v-icon>
      Logout
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { getUserData } from "@/repository/userRepository";
import { User } from "@/types/user";
import router from "@/router";
import firebase from "firebase";

@Component
export default class LogoutButton extends Vue {
  user?: User = {} as User;

  async created(): Promise<void> {
    this.user = await getUserData();
  }

  doLogout(): void {
    firebase.auth().signOut();
    if (router.currentRoute.path !== "/") {
      router.push("/");
    }
  }
}
</script>
<style scoped></style>
