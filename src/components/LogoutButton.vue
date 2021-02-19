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
import router from "@/router";
import { Auth } from "@/firebase/auth";

import { repository } from "@/repository";
import { User } from "@/types/user";

const userRepository = repository.v2.user;

@Component
export default class LogoutButton extends Vue {
  user?: User = {} as User;

  async created(): Promise<void> {
    this.user = await userRepository.getUserData(Auth.currentUid());
  }

  doLogout(): void {
    Auth.logout();
    if (router.currentRoute.path !== "/") {
      router.push("/");
    }
  }
}
</script>
<style scoped></style>
