<template>
  <div class="events">
    <h1>Events</h1>
    <new-event-form v-if="isLogin"/>
    <div class="events-list">
      <div v-if="events.length">
        <v-sheet
          class="pb-5"
          color="#FFECB3">
          <h1>now</h1>
          <event-item
            v-for="event in nowEvents"
            :key="event.id"
            :event="event" />
        </v-sheet>
        <v-sheet
          class="pb-5"
          color="#80DEEA">
          <h1>future</h1>
          <event-item
            v-for="event in futureEvents"
            :key="event.id"
            :event="event" />
        </v-sheet>
        <v-sheet
          class="pb-5"
          color="#E0E0E0">
          <h1>past</h1>
          <event-item
            v-for="event in pastEvents"
            :key="event.id"
            :event="event" />
        </v-sheet>

      </div>
    </div>
  </div>
</template>

<script>
  import NewEventForm from '@/components/NewEventForm.vue'
  import EventItem from '@/components/EventItem.vue'
  import { db } from '@/firebase/firestore.js'
  import firebase from 'firebase'

  export default {
    components: {
      NewEventForm,
      EventItem
    },
    data() {
      return {
        events: [],
        pastEvents: [],
        nowEvents: [],
        futureEvents: [],
        isLogin: false
      }
    },
    created() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.isLogin = true;
        }
      });
    },
    firestore () {
      return {
        events: db.collection('events').orderBy('start')
      }
    },
    watch: {
      events() {
        let pastEvents = [];
        let nowEvents = [];
        let futureEvents = [];
        let now = new Date();

        this.events.forEach(event =>{
          let startTime = event.start.toDate();
          let endTime = event.end.toDate();

          if (endTime < now) {
            pastEvents.push(event);
          } else if (startTime < now && now < endTime) {
            nowEvents.push(event);
          } else {
            futureEvents.push(event);
          }
        })
        // console.log(pastEvents);
        // console.log(nowEvents);
        // console.log(futureEvents);
        this.$root.$set(this, 'pastEvents', pastEvents.reverse()); //pastの中ではstartの逆順
        this.$root.$set(this, 'nowEvents', nowEvents); //start順
        this.$root.$set(this, 'futureEvents', futureEvents); //start順
      }
    }
  };
</script>
<style scoped>
</style>
