<template>
  <div class="events">
    <h1>Events</h1>
    <v-expansion-panels v-if="isLogin">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-card-title>
            <v-toolbar :flat="true">
              <v-toolbar-title class="mx-autoi">
                イベント新規作成
              </v-toolbar-title>
            </v-toolbar>
          </v-card-title>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <new-event-form />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="events-list">
      <event-item
        v-for="event in events"
        :key="event.id"
        :event="event" />
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
        events: db.collection('events').orderBy('createdTime', 'desc')
      }
    }
  };
</script>
<style scoped>
</style>
