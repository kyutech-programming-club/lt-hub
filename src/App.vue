<template>
  <v-app>
    <Header :currentUser="currentUser" />
    <v-main fluid fill-height align-start>
      <v-container>
        <router-view :currentUser="currentUser" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import { firebaseApp } from "@/firebase/firebase";
import {
  createUser,
  getUserData,
  userExists,
} from "@/repository/userRepository";
import { User } from "@/types/user";

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  currentUser = {} as User;

  created(): void {
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user !== null) {
        if (!(await userExists(user.uid))) {
          await createUser(user);
        }
        this.currentUser = await getUserData(user.uid);
      } else {
        this.currentUser = {} as User;
      }
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
