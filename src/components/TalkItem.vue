<template>
  <div class="talk-item">
    <v-card class="pa-4 ma-6" color="#C2EEFF" @click="goTalkPage" >
      <v-card-title>{{talk.title}}</v-card-title>
      <v-card-text v-if="talk.userRef.id">
        登壇者：
        <user-item-small
        :user = "talk.userRef" />
        <v-icon v-if="talk.movieUrl != ''">mdi-youtube</v-icon>
        <v-icon v-if="talk.slideUrl != ''">mdi-presentation</v-icon>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import UserItemSmall from "../components/UserItemSmall";

  export default {
    components: {
      UserItemSmall,
    },
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
