<template>
  <div class="events">
    <h1>This is Events page</h1>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Open</v-expansion-panel-header>
        <v-expansion-panel-content>
          <new-event-form />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
  import NewEventForm from '@/components/NewEventForm.vue'

  export default {
    components: {
      NewEventForm,
    }
  };
</script>
<style>
</style>
