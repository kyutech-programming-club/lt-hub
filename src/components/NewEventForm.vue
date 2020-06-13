<template>
  <div class="new-item-form">
    <v-card class="pa-4 ma-6">
      <v-form v-model="isValid" @submit.prevent>
        <v-card-text>
          <v-text-field
            v-model="title"
            label="イベント名"
            :rules="[requiredNotEmpty]" />
          <v-text-field
            v-model="description"
            label="イベント概要" />
          <vue-ctk-date-time-picker
            id="start"
            label="開始日時を選択"
            :format="'YYYY-MM-DD HH:mm'"
            :max-date="end"
            v-model="start" />
          <vue-ctk-date-time-picker
            id="end"
            label="終了日時を選択"
            :format="'YYYY-MM-DD HH:mm'"
            :min-date="start"
            v-model="end" />
          <v-text-field
            v-model="place"
            label="会場" />
          <v-btn
            class="white--text font-weight-bold"
            color="#009eff"
            :x-large="true"
            @click="createEvent">
            イベント作成
          </v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>
<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

  export default {
    components: {
      VueCtkDateTimePicker
    },
    data() {
      return {
        title: '',
        description: '',
        start: '',
        end: '',
        place: '',
        isValid: false
      };
    },
    watch: {
      title() {
        console.log('title: '+this.title);
      },
      description() {
        console.log('description: '+this.description);
      },
      start() {
        console.log('start: '+this.start);
      },
      end() {
        console.log('end: '+this.end);
      },
      place() {
        console.log('place: '+this.place);
      },
    },
    methods: {
      async createEvent() {
        if (this.isValid) {
          firebase.auth().onAuthStateChanged(user => {
            db.collection('events')
              .doc()
              .set({
                title: this.title,
                description: this.description,
                author: db.collection('users').doc(user.uid),
                start: this.start,
                end: this.end,
                place: this.place,
                participants: [],
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                console.log(`Event ${this.title} was created.`);
                //this.$router.go(this.$router.currentRoute);
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
      },
    }
  };
</script>
<style scoped>
</style>
