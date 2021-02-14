<template>
  <v-app>
    <Header :uid="currentUid" />
    <v-main fluid fill-height align-start>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import { firebaseApp } from "@/firebase/firebase";
import { Auth } from "@/firebase/auth";
import { createUser, userExists } from "@/repository/userRepository";

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  currentUid = "";
  mounted(): void {
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user !== null && (await userExists(user.uid)) === false) {
        await createUser(user);
      }
      this.currentUid = Auth.currentUid();
    });
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
