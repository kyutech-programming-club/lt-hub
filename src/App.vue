<template>
  <v-app>
    <Header :currentUser="currentUser" />
    <v-main fluid fill-height align-start>
      <v-container>
        <router-view :currentUser="currentUser" :key="isLogin" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import { firebaseApp } from "@/firebase/firebase";
import { repository } from "@/repository";
import { User } from "@/types/user";

const userRepository = repository.v2.user;

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  currentUser = {} as User;
  isLogin = false;

  created(): void {
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user !== null) {
        if (!(await userRepository.userExists(user.uid))) {
          await userRepository.createUser(user);
        }
        this.currentUser = await userRepository.getUserData(user.uid);
        this.isLogin = true;
      } else {
        this.currentUser = {} as User;
        this.isLogin = false;
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
