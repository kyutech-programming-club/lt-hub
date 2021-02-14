<template>
  <div class="login-button">
    <v-btn
      class="ma-2"
      style="text-transform: none"
      color="white"
      :loading="loading"
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
import { Auth } from "@/firebase/auth";

@Component
export default class LoginButton extends Vue {
  loading = false;

  doLogin(): void {
    this.loading = true;
    Auth.login().finally(() => {
      this.loading = false;
    });
  }
}
</script>
<style scoped></style>
