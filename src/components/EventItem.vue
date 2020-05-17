<template>
  <div class="event-item">
    <v-card class="pa-4 ma-6">
      <v-card-title>{{event.title}}</v-card-title>
      <v-card-text>
        期間：{{event.startDate}} {{event.startTime}} ~ {{event.endDate}} {{event.endTime}}<br>
        責任者：{{event.author}}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: {
      event: Object
    }
  }
</script>

<style>
</style>
