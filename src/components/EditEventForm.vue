<template>
  <div class="edit-item-form">
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
            color="blue"
            :x-large="true"
            @click="updateEvent">
            Update
          </v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>
<script>
  import { db } from '@/firebase/firestore.js'
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

  export default {
    props: {
      event: {
        type: Object
      }
    },
    components: {
      VueCtkDateTimePicker
    },
    data() {
      return {
        title: this.event.data.title,
        description: this.event.data.description,
        start: this.event.data.start,
        end: this.event.data.end,
        place: this.event.data.place,
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
      updateEvent() {
        console.log('update event...');
        if (this.isValid) {
          db.collection('events')
            .doc(this.event.id)
            .update({
              title: this.title,
              description: this.description,
              start: this.start,
              end: this.end,
              place: this.place,
            })
            .then(() => {
              console.log(`Event ${this.title} was updated.`);
              this.$router.go(this.$router.currentRoute);
            })
            .catch(err => {
              console.error(`Error occurd in updateEvent: ${err}`);
            });
        } else {
          console.log("Error occurred on validation.");
        }
      },
      requiredNotEmpty(value) {
        //イベント名のみ入力必須項目
        const spaceRemoved = value.replace(/\s/g, '');
        if (!spaceRemoved)
          return "Required.";
        return true;
      }
    }
  };
</script>
<style scoped>
</style>
