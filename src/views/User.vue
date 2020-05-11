<template>
  <div class="user">
    <h1>User Page</h1>
    <div v-if="user.name">
      <img :src="user.photoURL"/><br>
      [{{ user.name }}]<br>
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
      }
    },
    created() {
      let self = this
      console.log("User Page");
      db.collection("users")
        .doc(this.$route.params['uid'])
        .get()
        .then(function(dbUser) {
          if (dbUser.exists) {
            console.log('Successfully fetched user data:', dbUser.data());
            self.user = dbUser.data();
          } else {
            firebase.auth().onAuthStateChanged(currentUser => {
              console.log("Creating user data...");
              db.collection('users')
                .doc(currentUser.uid)
                .set({
                  name: currentUser.displayName,
                  photoURL: currentUser.photoURL
                })
                .then(() => {
                  console.log(`Event ${currentUser.displayName} was created.`);
                  self.$router.go(self.$router.currentRoute)
                })
                .catch(err => {
                  console.error(`Error occurd in createEvent: ${err}`);
                });
            });
          }
        })
        .catch(err => {
          console.error(`Error fetching user data: ${err}`);
        });
    },
    methods: {
    }
  }
</script>
<style>
</style>
