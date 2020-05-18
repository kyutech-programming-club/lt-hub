<template>
  <div class="events">
    <h1>This is Events page</h1>
    <v-expansion-panels>
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

  export default {
    components: {
      NewEventForm,
      EventItem
    },
    data() {
      return {
        events: []
      }
    },
    created() {
      console.log('created...');
      let self = this;
      // orderBy('startTime')もしたいけどできない！！！！！！！！！！！
      // 今のままだと、同日中の開催時間が無視されている。。。
      db.collection('events').orderBy('startDate').get().then(events => {
        events.forEach(event => {
          console.log(event.id);
          console.log(event.data());
          self.events.push(
            {
              id: event.id,
              data: event.data()
            }
          );
        });
      });
    }
  };
</script>
<style>
</style>
