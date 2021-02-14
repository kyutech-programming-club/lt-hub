<template>
  <div class="google-auth">
    <v-btn
      class="ma-2"
      style="text-transform: none"
      color="white"
      @click="doLogin"
      outlined
      dark
    >
      <v-icon dark left>mdi-login</v-icon>
      Login
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import router from "@/router";
import firebase from "firebase";

@Component
export default class LoginButton extends Vue {
  doLogin(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
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
