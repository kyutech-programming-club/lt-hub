<template>
  <div class="new-item-form">
    <v-card class="pa-4 ma-6">
      <v-card-text>
        <v-text-field
          v-model="title"
          label="イベント名" />
        <v-text-field
          v-model="description"
          label="イベント概要" />
        <v-date-picker
          v-model="startDate"
          label="開始日"/>
        <v-time-picker
          v-model="startTime"
          label="開始時刻"/>
        <v-date-picker
          v-model="endDate"
          label="終了日"/>
        <v-time-picker
          v-model="endTime"
          label="終了時刻"/>
        <v-text-field
          v-model="place"
          label="会場" />
        <v-btn
          color="blue"
          :x-large="true"
          @click="createEvent">
          イベント作成
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'

  export default {
    data() {
      return {
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        place: '',
      };
    },
    watch: {
      title() {
        console.log('title: '+this.title);
      },
      description() {
        console.log('description: '+this.description);
      },
      startDate() {
        console.log('startDate: '+this.startDate);
      },
      startTime() {
        console.log('startTime: '+this.startTime);
      },
      endDate() {
        console.log('endDate: '+this.endDate);
      },
      endTime() {
        console.log('endTime: '+this.endTime);
      },
      place() {
        console.log('place: '+this.place);
      },
    },
    methods: {
      createEvent() {
        console.log('Creating event...');
        firebase.auth().onAuthStateChanged(user => {
          db.collection('events')
            .doc()
            .set({
              title: this.title,
              description: this.description,
              author: user.uid,
              startDate: this.startDate,
              startTime: this.startTime,
              endDate: this.endDate,
              endTime: this.endTime,
              place: this.place,
            })
            .then(() => {
              console.log(`Event ${this.title} was created.`);
              this.$router.go(this.$router.currentRoute);
            })
            .catch(err => {
              console.error(`Error occurd in createEvent: ${err}`);
            });
        });
      }
    }
  };
</script>
<style scoped>
</style>
