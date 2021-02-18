<template>
  <div class="event-item">
    <v-card>
      <v-card-title> {{ event.title }}</v-card-title>
    </v-card>
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
