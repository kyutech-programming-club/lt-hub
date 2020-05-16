<template>
  <div class="github-auth">
    <h1>{{ msg }}</h1>
    <div v-if="user.name" key="login">
      <img :src="user.photoURL"/><br>
      <button @click="goMyPage">[{{ user.name }}](go to MyPage)</button><br>
      <v-btn class="ma-2"
             style="text-transform: none"
             color="black"
             @click="doLogout"
             dark>
        <v-icon dark left>mdi-logout</v-icon>
        Logout
      </v-btn>
    </div>
    <!-- 未ログイン時にはログインボタンを表示 -->
    <div v-else key="logout">
      <v-btn class="ma-2"
             style="text-transform: none"
             color="black"
             :loading="loggingIn"
             @click="doLogin"
             dark>
        <v-icon dark left>mdi-github</v-icon>
        Sign in with GitHub
      </v-btn>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase/firestore.js'

export default {
  name: 'GithubAuth',
  props: {
    msg: String
  },
  data() {
    return {
      user: {},
      loggingIn: false,
    }
  },
  created() {
    console.log('Start GithubAuth...');
    let self = this;

    firebase.auth().onAuthStateChanged(user => {

      if (user != null) {
          console.log('Successfully Login');
          // console.log(JSON.stringify(user));

          db.collection('users')
            .doc(user.uid)
            .get()
            .then(dbUser => {
              if (dbUser.exists) {
                console.log('Successfully fetched user data');
                // console.log(JSON.stringify(dbUser.data()));
                self.user = dbUser.data();
              } else {
                console.log('Creating user data...');

                db.collection('users')
                  .doc(user.uid)
                  .set({
                    name: user.displayName || 'ななっしー',
                    photoURL: user.photoURL
                  })
                  .then(() => {
                    console.log('Successfully created new user');
                    // console.log(JSON.stringify(user));
                    db.collection('users')
                      .doc(user.uid)
                      .get()
                      .then(dbUser => {
                        console.log('Successfully fetched user data');
                        // console.log(JSON.stringify(dbUser.data()));
                        self.user = dbUser.data();
                      });
                  })
                  .catch(err => {
                    console.error('Error Creating new user: ', err);
                  });
              }
            })
            .catch(err => {
              console.error('Error fetching user data: ', err);
            });
      } else {
        self.user = {};
      }
    })
  },
  methods: {
    doLogin() {
      console.log('doLogin');
      this.loggingIn = true;
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithPopup(provider)
                     .finally(() => {
                       this.loggingIn = false;
                     });
    },
    doLogout() {
      console.log('doLogout');
      firebase.auth().signOut();
    },
    goMyPage() {
      console.log('goMyPage');
      firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
          this.$router.push({ name : "user", params: { uid: user.uid}});
        }
      });
    }
  }
}
</script>
