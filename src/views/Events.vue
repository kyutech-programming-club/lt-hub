<template>
  <div class="events">
    <h1>Events</h1>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Component from "vue-class-component";
import { User } from "@/types/user";
import { Event } from "@/types/event";
import { getEventList } from "@/repository/eventRepository";

const EventsProps = Vue.extend({
  props: {
    currentUser: Object as PropType<User>,
  },
});

@Component({})
export default class Events extends EventsProps {
  events: Array<Event> = [];

  async created(): Promise<void> {
    await this.fetchEvents();
    console.dir(this.events);
  }

  async fetchEvents(): Promise<void> {
    this.events = await getEventList(this.currentUser);
  }
}
</script>
<style scoped></style>
