<template>
  <div class="events">
    <h1>Events</h1>
    <div class="events-list" v-if="events.length">
      <div v-for="event in events" :key="event.id">
        <EventListItem :event="event" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Component from "vue-class-component";
import EventListItem from "@/components/events/EventListItem.vue";
import { User } from "@/types/user";
import { Event } from "@/types/event";
import { repository } from "@/repository";

const eventRepository = repository.v2.event;

const EventsProps = Vue.extend({
  props: {
    currentUser: Object as PropType<User>,
  },
});

@Component({
  components: {
    EventListItem,
  },
})
export default class Events extends EventsProps {
  events: Array<Event> = [];

  async created(): Promise<void> {
    await this.fetchEvents();
  }

  async fetchEvents(): Promise<void> {
    this.events = await eventRepository.getEventList(this.currentUser);
  }
}
</script>
<style scoped></style>
