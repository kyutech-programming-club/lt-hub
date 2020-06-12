<template>
  <div class="talk-item">
    <v-card class="pa-4 ma-6" color="blue" @click="goTalkPage" >
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
    methods: {
      goTalkPage() {
        this.$router.push({ name : 'talk', params: { id: this.talk.id, talkData: this.talk }});
      }
    }
  }
</script>

<style scoped>

</style>
