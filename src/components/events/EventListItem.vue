<template>
  <div class="event-item">
    <div v-if="event.id">
      <v-card>
        <v-card-title> {{ event.title }}</v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Component from "vue-class-component";
import { Event } from "@/types/event";

const EventListItemProps = Vue.extend({
  props: {
    event: Object as PropType<Event>,
  },
});

@Component({})
export default class EventListItem extends EventListItemProps {}
</script>

<style scoped></style>
