<template>
  <div class="edit-item-form">
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
          @click="updateEvent">
          Update
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
  import { db } from '@/firebase/firestore.js'

  export default {
    props: {
      event: Object
    },
    data() {
      return {
        title: this.event.data.title,
        description: this.event.data.description,
        startDate: this.event.data.startDate,
        startTime: this.event.data.startTime,
        endDate: this.event.data.endDate,
        endTime: this.event.data.endTime,
        place: this.event.data.place,
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
      updateEvent() {
        console.log('update event...');
        db.collection('events')
          .doc(this.event.id)
          .update({
            title: this.title,
            description: this.description,
            startDate: this.startDate,
            startTime: this.startTime,
            endDate: this.endDate,
            endTime: this.endTime,
            place: this.place,
          })
          .then(() => {
          console.log(`Event ${this.title} was updated.`);
          this.$router.go(this.$router.currentRoute);
          })
          .catch(err => {
          console.error(`Error occurd in updateEvent: ${err}`);
          });
      }
    }
  };
</script>
<style scoped>
</style>
