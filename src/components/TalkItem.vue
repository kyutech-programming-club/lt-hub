<template>
  <div class="talk-item">
    <v-card class="pa-4 ma-6" >
      <v-card-title>{{talk.data.title}}</v-card-title>
      <v-card-text>
        登壇者：{{talk.talkUser.data.name}}<br>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: {
      talk: {
        type: Object
      }
    },
  }
</script>

<style scoped>

</style>