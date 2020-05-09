<template>
  <div class="github-auth">
    <h1>{{ msg }}</h1>
    <div v-if="user.uid" key="login">
      <img :src="user.photoURL"/><br>
      [{{ user.displayName }}]<br>
      <button type="button" @click="doLogout">ログアウト</button>
    </div>
    <!-- 未ログイン時にはログインボタンを表示 -->
    <div v-else key="logout">
      <v-btn class="ma-2"
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
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
    })
  },
  methods: {
    doLogin() {
      console.log("doLogin");
      this.loggingIn = true;
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithPopup(provider)
                     .finally(() => {
                       this.loggingIn = false;
                     });
    },
    doLogout() {
      console.log("doLogout");
      firebase.auth().signOut()
    }
  }
}
</script>
