<template>
  <div class="new-talk-form">
    <v-card class="pa-4 ma-6">
      <v-form v-model="isValid" @submit.prevent>
        <v-card-text>
          <v-text-field
            v-model="title"
            label="タイトル"
            :rules="[requiredNotEmpty]" />
          <v-text-field
            v-model="slideUrl"
            label="スライドURL" />
          <v-text-field
            v-model="movieUrl"
            label="動画URL" />
          <v-btn
            color="blue"
            :x-large="true"
            @click="createTalk">
            トーク作成
          </v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>
<script>
  import firebase from 'firebase';
  import { db } from '@/firebase/firestore.js'

  export default {
    props: {
      eventId: {
        type: String
      }
    },
    data() {
      return {
        title: '',
        slideUrl: '',
        movieUrl: '',
        isValid: false
      };
    },
    watch: {
      title() {
        console.log('title: '+this.title);
      },
      slideUrl() {
        console.log('slide: '+this.slideUrl);
      },
      movieUrl() {
        console.log('movie: '+this.movieUrl);
      },
    },
    methods: {
      createTalk() {
        if (this.isValid) {
          let self = this;
          firebase.auth().onAuthStateChanged(async(user) => {
            let userRef = await db.collection('users').doc(user.uid);
            let eventRef = await db.collection('events').doc(self.eventId);
            db.collection('talks')
              .doc()
              .set({
                userRef:userRef,
                eventRef:eventRef,
                title: this.title,
                slideUrl: this.slideUrl,
                movieUrl: this.movieUrl,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                console.log(`Event ${this.title} was created.`);
                this.$router.go(this.$router.currentRoute);
              })
              .catch(err => {
                console.error(`Error occurd in createEvent: ${err}`);
              });
          });
        } else {
          console.log('Error occurred on validation.');
        }
      },
      requiredNotEmpty(value) {
        //イベント名のみ入力必須項目
        const spaceRemoved = value.replace(/\s/g, '');
        if (!spaceRemoved)
          return 'Required.';
        return true;
      }
    }
  };
</script>
<style scoped>
</style>
