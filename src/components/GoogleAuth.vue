<template>
  <div class="google-auth">
    <div v-if="user" key="login">
      <v-avatar @click="goMyPage(user.id)">
        <img :src="user.data.photoURL" />
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
    <!-- 未ログイン時にはログインボタンを表示 -->
    <div v-else key="logout">
      <v-btn
        class="ma-2"
        style="text-transform: none"
        color="white"
        :loading="loggingIn"
        @click="doLogin"
        outlined
        dark
      >
        <v-img src="@/assets/google-logo.png" left class="mr-2" />
        Login
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import router from "@/router";
import firebase from "firebase";
import { db } from "@/firebase/firestore.ts";
import User from "@/types/user.ts";

@Component
export default class GoogleAuth extends Vue {
  user: User | null = null;
  loggingIn = false;

  created(): void {
    firebase.auth().onAuthStateChanged(async (user: firebase.User | null) => {
      if (user != null) {
        let dbUser: firebase.firestore.DocumentSnapshot = await db
          .collection("users")
          .doc(user.uid)
          .get();
        // TODO To make return type
        // .catch((err) => {
        //   console.error("Error fetching user data: ", err);
        //   return ;
        // });
        if (dbUser.exists) {
          this.user = {
            id: dbUser.id,
            data: dbUser.data(),
          };
        } else {
          await db
            .collection("users")
            .doc(user.uid)
            .set({
              name: user.displayName || "ななっしー",
              photoURL: user.photoURL,
              createdTime: firebase.firestore.FieldValue.serverTimestamp(),
              updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .catch((err) => {
              console.error("Error Creating new user: ", err);
            });
          let newUser: firebase.firestore.DocumentSnapshot = await db
            .collection("users")
            .doc(user.uid)
            .get();
          this.user = {
            id: newUser.id,
            data: newUser.data(),
          };
        }
      } else {
        this.user = null;
      }
    });
  }

  doLogin(): void {
    this.loggingIn = true;
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .finally(() => {
        this.loggingIn = false;
      });
  }
  doLogout(): void {
    firebase.auth().signOut();
    if (router.currentRoute.path !== "/") {
      router.push("/");
    }
  }
  goMyPage(id: string): void {
    router.push({ name: "user", params: { uid: id } }).catch((e) => {
      console.log(e);
    });
  }
}
</script>
<style scoped></style>
