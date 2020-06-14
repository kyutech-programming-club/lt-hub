<template>
  <div class="events">
    <h1>Events</h1>
    <new-event-form v-if="isLogin"/>
    <div class="events-list">
      <div v-if="events.length">
        <event-item
          v-for="event in events"
          :key="event.id"
          :event="event" />
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
    }
  };
</script>
<style scoped>
</style>
