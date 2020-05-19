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
  </div>
</template>

<script>
  import { db } from '@/firebase/firestore.js'

  export default {
    name: 'Event',
    data() {
      return {
        event: {},
        author: {}
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
      }
    }
  }
</script>
