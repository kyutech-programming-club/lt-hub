<template>
  <div class="user">
    <h1>User Page</h1>
    <div v-if="user.name">
      <img :src="user.photoURL"/><br>
      [{{ user.name }}]<br>
      <div v-if="joinEvents" class="events-list">
        <event-item
          v-for="event in joinEvents"
          :key="event.id"
          :event="event" />
      </div>
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
              <v-form v-model="isValid" @submit.prevent>
                <v-card-text>
                  <v-text-field
                    v-model="name"
                    label="Name"
                    :rules="[requiredNotEmpty]" />
                  <v-btn
                    color="blue"
                    :x-large="true"
                    @click="update">
                    Update
                  </v-btn>
                </v-card-text>
              </v-form>
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
  import EventItem from '@/components/EventItem.vue'

  export default {
    name: 'User',
    components: {
      EventItem
    },
    data() {
      return {
        user: {},
        current: false,
        name: "",
        joinEvents: [],
        isValid: false
      }
    },
    created() {
      let self = this
      console.log('User Page');
      db.collection('users')
        .doc(this.$route.params['uid'])
        .get()
        .then(dbUser => {
          if (dbUser.exists) {
            console.log('Successfully fetched user data');
            console.log(dbUser.data());
            self.user = dbUser.data();
            self.name = dbUser.data().name;

            if (dbUser.data().joinEvents.length) {
              dbUser.data().joinEvents.forEach( async(eventRef) => {
                let event = await eventRef.get();//参照型からデータの取得は非同期
                self.joinEvents.push({
                  id: event.id,
                  data: event.data()
                });
              });
            }
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
      name() {
        console.log("name: "+this.name);
      }
    },
    methods: {
      update() {
        console.log('update...');
        if (this.isValid) {
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
              console.error(`Error occurred in update: ${err}`);
            });
        } else {
          console.log("Error occurred on validation.");
        }
      },
      requiredNotEmpty(value) {
        const spaceRemoved = value.replace(/\s/g, '');
        if (!spaceRemoved)
          return "Name is required.";
        return true;
      }
    }
  }
</script>
<style scoped>
</style>
