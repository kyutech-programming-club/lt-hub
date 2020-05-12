<template>
  <div class="user">
    <h1>User Page</h1>
    <div v-if="user.name">
      <img :src="user.photoURL"/><br>
      [{{ user.name }}]<br>
    </div>
    <div v-if="current">
      <b>This is My Page</b>
    </div>

  </div>
</template>

<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'

  export default {
    name: 'User',
    data() {
      return {
        user: {},
        current: false
      }
    },
    created() {
      let self = this
      console.log('User Page');
      db.collection('users')
        .doc(this.$route.params['uid'])
        .get()
        .then(function(dbUser) {
          if (dbUser.exists) {
            console.log('Successfully fetched user data');
            // console.log(JSON.stringify(dbUser.data()));
            self.user = dbUser.data();
          } else {
            console.error('Error fetching user data');
            self.user = {};
          }
        })
        .catch(err => {
          console.error('Error fetching user data: ', err);
        });

      firebase.auth().onAuthStateChanged(user => {
        if (user != null && user.uid == this.$route.params['uid']) {
          self.current = true;
        }
      })
    }
  }
</script>
<style>
</style>
