<template>
  <div class="events">
    <h1>Events</h1>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Component from "vue-class-component";
import { User } from "@/types/user";

const EventsProps = Vue.extend({
  props: {
    currentUser: Object as PropType<User>,
  },
});

@Component({})
export default class Events extends EventsProps {
  created(): void {
    console.dir(this.currentUser);
  }
}
</script>
<style scoped></style>
