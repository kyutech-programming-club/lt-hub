<template>
  <div class="event">
    <h1>Event Page</h1>
    <div v-if="event.id">
      <h2>{{ event.data.title }}</h2>
      期間：{{event.data.startDate}} {{event.data.startTime}} ~ {{event.data.endDate}} {{event.data.endTime}}<br>
      場所：{{event.data.place}}<br>
    </div>
    <div v-if="author.id">
      責任者：
      <v-btn @click="goUserPage">
        {{author.data.name}}
      </v-btn>
    </div>
    <div v-if="current">
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
            <edit-event-form :event="event"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-btn @click="deleteEvent">
        Delete
      </v-btn>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import EditEventForm from '@/components/EditEventForm.vue'
  import { db } from '@/firebase/firestore.js'

  export default {
    name: 'Event',
    components: {
      EditEventForm
    },
    data() {
      return {
        event: {},
        author: {},
        current: false
      }
    },
    created() {
      let self = this
      console.log('Event Page');
      db.collection('events')
        .doc(this.$route.params['id'])
        .get()
        .then(event => {
          if (event.exists) {
            console.log('Successfully fetched event data');
            // console.log(JSON.stringify(event.data()));
            self.event = {
              id: event.id,
              data: event.data()
            }

            db.collection('users')
              .doc(event.data().author)
              .get()
              .then(author => {
                if (author != null) {
                  self.author = {
                    id: author.id,
                    data: author.data()
                  }
                }
              })
              .catch(err => {
                console.error('Error fetching author data: ', err);
              });


            firebase.auth().onAuthStateChanged(user => {
              if (user != null && user.uid == event.data().author) {
                self.current = true;
              }
            });

          } else {
            console.error('Error fetching event data');
            self.event = {};
          }
        })
        .catch(err => {
          console.error('Error fetching event data: ', err);
        });
    },
    methods: {
      goUserPage() {
        console.log('goUserPage');
        this.$router.push({ name : 'user', params: { uid: this.author.id}});
      },
      deleteEvent() {
        console.log('deleteEvent');
        db.collection('events')
          .doc(this.$route.params['id'])
          .delete()
          .then(() => {
            this.$router.push({ name : 'Events'});
          })
          .catch(err => {
            console.error('Error deleting event data: ', err);
          });
      },
    }
  }
</script>
