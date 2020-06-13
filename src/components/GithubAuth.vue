<template>
  <div class="github-auth">
    <div v-if="user.uid">
      <v-btn @click="logout">LOGOUT</v-btn>
    </div>
    <div v-else>
      <div id="firebaseui-auth-container"></div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import firebaseui from 'firebaseui-ja'
  import 'firebaseui/dist/firebaseui.css'

  export default {
    data() {
      return {
        user: {}
      }
    },
    created(){
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.user = user
        }
      });
    },
    mounted() {
      var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container',{
        // callbacks: {
        //   signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        //     console.log(authResult);
        //     console.log(redirectUrl);
        //     return false;
        //   }
        // },
        
        signInOptions: [
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
        ]
      });
    },
    methods: {
      logout() {
        firebase.auth().signOut().then(() => {
          console.log("Sign out.");
          this.$router.go(this.$router.currentRoute);
        });
      }
    }
  }
</script>
<style scoped>
</style>
