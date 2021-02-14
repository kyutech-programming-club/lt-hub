<template>
  <div class="login-button">
    <v-btn
      class="ma-2"
      style="text-transform: none"
      color="white"
      @click="doLogin"
      outlined
      dark
    >
      <v-img src="@/assets/google-logo.png" left class="mr-2" />
      Login
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import firebase from "firebase";

@Component
export default class LoginButton extends Vue {
  doLogin(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
}
</script>
<style scoped></style>
