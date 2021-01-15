<template>
  <div class="github-auth">
    <div v-if="user.id" key="login">
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

<script>
import firebase from "firebase";
import { db } from "@/firebase/firestore.ts";
export default {
  name: "GithubAuth",
  data() {
    return {
      user: {},
      loggingIn: false,
    };
  },
  created() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self = this;

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((dbUser) => {
            if (dbUser.exists) {
              self.user = {
                id: dbUser.id,
                data: dbUser.data(),
              };
            } else {
              db.collection("users")
                .doc(user.uid)
                .set({
                  name: user.displayName || "ななっしー",
                  photoURL: user.photoURL,
                  createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                  updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                  db.collection("users")
                    .doc(user.uid)
                    .get()
                    .then((dbUser) => {
                      self.user = {
                        id: dbUser.id,
                        data: dbUser.data(),
                      };
                    });
                })
                .catch((err) => {
                  console.error("Error Creating new user: ", err);
                });
            }
          })
          .catch((err) => {
            console.error("Error fetching user data: ", err);
          });
      } else {
        self.user = {};
      }
    });
  },
  methods: {
    doLogin() {
      this.loggingIn = true;
      // const provider = new firebase.auth.GithubAuthProvider();
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .finally(() => {
          this.loggingIn = false;
        });
    },
    doLogout() {
      firebase.auth().signOut();
      this.$router.go(this.$router.currentRoute);
    },
    goMyPage(id) {
      this.$router.push({ name: "user", params: { uid: id } }).catch((e) => {
        console.log(e);
      });
    },
  },
};
</script>
<style scoped></style>
