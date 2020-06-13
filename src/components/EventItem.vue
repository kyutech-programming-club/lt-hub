<template>
  <div class="event-item">
    <v-card class="pa-4 ma-6" color="#CBFFD3" @click="goEventPage">
      <v-card-title>{{event.title}}</v-card-title>
      <v-card-text>
        期間：{{event.start}} ~ {{event.end}}<br>
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
        this.$router.push({ name : 'event', params: { id: this.event.id}});
      }
    }
  }
</script>

<style scoped>
</style>
