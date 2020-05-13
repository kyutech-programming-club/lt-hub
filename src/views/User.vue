<template>
  <div class="user">
    <h1>User Page</h1>
    <div v-if="user.name">
      <img :src="user.photoURL"/><br>
      [{{ user.name }}]<br>
    </div>
    <div v-if="current">
      <b>This is My Page</b>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-card-title>
              <v-toolbar :flat="true">
                <v-toolbar-title class="mx-autoi">
                  Edit
                </v-toolbar-title>
              </v-toolbar>
            </v-card-title>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card class="pa-4 ma-6">
              <v-card-text>
                <v-text-field
                  v-model="name"
                  label="Name" />
                <v-btn
                  color="blue"
                  :x-large="true"
                  @click="update">
                  Update
                </v-btn>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
        current: false,
        name: ""
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
            self.name = dbUser.data().name;
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
    },
    watch: {
      name: function() {
        console.log("name: "+this.name);
      }
    },
    methods: {
      update: function() {
        console.log('update...');
        db.collection('users')
          .doc(this.$route.params['uid'])
          .update({
            name: this.name
          })
          .then(() => {
            console.log(`User ${this.name} was updated.`);
            this.$router.go(this.$router.currentRoute);
          })
          .catch(err => {
            console.error(`Error occurd in update: ${err}`);
          });
      }
    }
  }
</script>
<style>
</style>
