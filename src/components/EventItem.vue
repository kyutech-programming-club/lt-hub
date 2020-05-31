<template>
  <div class="event-item">
    <v-card class="pa-4 ma-6"  @click="goEventPage">
      <v-card-title>{{event.data.title}}</v-card-title>
      <v-card-text>
        期間：{{event.data.start}} ~ {{event.data.end}}<br>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: {
      event: {
        type: Object
      }
    },
    methods: {
      goEventPage() {
        console.log('goEventPage');
        this.$router.push({ name : 'event', params: { id: this.event.id}});
      }
    }
  }
</script>

<style>
</style>
