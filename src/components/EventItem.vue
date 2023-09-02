<template>
  <div class="event-item">
    <div v-if="event.id">
      <v-card class="pa-2 mb-2" :color="colors[status][Number(isParticipated)]" @click="goEventPage">
        <v-container class="pa-0 ma-0">
          <v-row class="justify-content-between">
            <v-col class="pa-0 ma-0">
              <v-chip :color="colors[status][Number(isParticipated)]" class="ma-0">{{messages[status]}}</v-chip>
            </v-col>
            <v-col class="pa-0 ma-0">
              <v-chip v-if="isParticipated" color="white">
                <v-icon color="green" large>mdi-check-bold</v-icon>
              </v-chip>
            </v-col>
          </v-row>
        </v-container>
        <h1 class="text-center mb-3">{{event.title}}</h1>
        参加者数  {{participants.length}}人（ LT数 {{talks.length}} ）
        <div v-if="event.start">
          期間：{{ getStringFromDate(this.event.start.toDate()).substr(0,16) }} ~ {{ getStringFromDate(this.event.end.toDate()).substr(0,16) }}<br>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
  import { db } from '@/firebase/firestore.js'
  export default {
    props: {
      event: {
        type: Object
      },
    },
    data() {
      return {
        status: '',
        colors: [['#fffde7', '#fff176'], ['#e3f2fd', '#64b5f6'], ['#fafafa', '#9e9e9e']],
        messages: ['開催中！', '開催予定', '終了イベント'],
        isParticipated: false,
        participants: [],
        talks: []
      }
    },
    created() {
      let now = new Date();
      if (this.event.end.toDate() < now) {
        this.status = 2;
      } else if (this.event.start.toDate() < now && now < this.event.end.toDate()) {
        this.status = 0;
      } else {
        this.status = 1;
      }
      firebase.auth().onAuthStateChanged(async(user) => {
        if (user) {
          let currentUser = await db.collection('users').doc(user.uid);
          let currentEvent = await db.collection('events').doc(this.event.id);
          await db.collection('participants')
            .where('eventRef', '==', currentEvent)
            .where('userRef', '==', currentUser)
            .get().then(participant => {
              // console.dir(participant);
              if (!participant.empty) {
                this.isParticipated = true;
              }
            });
        }
      });
    },
    firestore(){
      console.log("firestore");
      return {
        talks: db.collection('talks')
          .where('eventRef', '==', db.collection('events').doc(this.event.id)),
        participants: db.collection('participants')
          .where('eventRef', '==', db.collection('events').doc(this.event.id)),
      }
    },
    methods: {
      goEventPage() {
        this.$router.push({ name : 'event', params: { id: this.event.id, event: this.event}});
      },
      //日付から文字列に変換する関数
      getStringFromDate(date) {
        var year_str = date.getFullYear();
        //月だけ+1すること
        var month_str = 1 + date.getMonth();
        var day_str = date.getDate();
        var hour_str = date.getHours();
        var minute_str = date.getMinutes();
        var second_str = date.getSeconds();

        month_str = ('0' + month_str).slice(-2);
        day_str = ('0' + day_str).slice(-2);
        hour_str = ('0' + hour_str).slice(-2);
        minute_str = ('0' + minute_str).slice(-2);
        second_str = ('0' + second_str).slice(-2);

        var format_str = 'YYYY/MM/DD hh:mm:ss';
        format_str = format_str.replace(/YYYY/g, year_str);
        format_str = format_str.replace(/MM/g, month_str);
        format_str = format_str.replace(/DD/g, day_str);
        format_str = format_str.replace(/hh/g, hour_str);
        format_str = format_str.replace(/mm/g, minute_str);
        format_str = format_str.replace(/ss/g, second_str);

        return format_str;
      }
    }
  }
</script>

<style scoped>
</style>
