<template>
  <div class="event">
    <div v-if="event.id">
      <div>
        <h1>{{ event.title }}</h1>
        <div v-if="event.start">
          期間：{{ getStringFromDate(this.event.start.toDate()).substr(0,16) }} ~ {{ getStringFromDate(this.event.end.toDate()).substr(0,16) }}<br>
        </div>
        場所：{{ event.place }}<br>
        <div v-if="event.createdTime">
          作成日時：{{ getStringFromDate(event.createdTime.toDate()) }}<br>
        </div>
        <div v-if="event.updatedTime">
          最終更新日時：{{ getStringFromDate(event.updatedTime.toDate()) }}
        </div>
      </div>
      <div v-if="event.author.id">
        責任者：
        <user-item-small
          :user = "event.author" />
        <div v-if="event.author.id == currentUserId">
          <edit-event-form :event="event"/>
          <v-btn class="white--text font-weight-bold" color="#ff4b4b" @click="deleteEvent">
            Delete
          </v-btn>
        </div>
      </div>
    </div>
    <div  v-if="isParticipated">
      <v-btn class="white--text font-weight-bold" color="#ff4b4b" @click="cancelParticipate">
        参加取り消し
      </v-btn>
      <new-talk-form
      :eventId="event.id"
      :userId="currentUserId"/>
    </div>
    <div v-else-if="currentUserId">
      <v-btn
        class="white--text font-weight-bold"
        color="#009eff"
        @click="participate">
        参加
      </v-btn>
    </div>
    <div class="talks-list">
      <talk-item
        v-for="talk in talks"
        :key="talk.id"
        :talk="talk"/>
    </div>
    <div v-if="participants" class="users-list">
      参加者リスト<br>
      <participate-item
        v-for="user in participants"
        :key="user.id"
        :user="user" />
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import EditEventForm from '@/components/EditEventForm.vue'
  import NewTalkForm from '@/components/NewTalkForm.vue'
  import ParticipateItem from '@/components/ParticipateItem.vue'
  import UserItemSmall from '@/components/UserItemSmall.vue'
  import TalkItem from '@/components/TalkItem.vue'
  import { db } from '@/firebase/firestore.js'

  export default {
    name: 'Event',
    components: {
      ParticipateItem,
      EditEventForm,
      UserItemSmall,
      TalkItem,
      NewTalkForm,
    },
    data() {
      return {
        event: [],
        talks: [],
        participants: [],
        isParticipated: false,
        author: {},
        currentUserId: '',
        participated: false,
        isAuthor: false,
      }
    },
    created() {
      console.log("created");
      let self = this;
      firebase.auth().onAuthStateChanged(async(user) => {
        if (user != null) {
          this.$root.$set(self, 'currentUserId', user.uid);
        }
      });
    },
    watch: {
      async event() {
        let currentUserRef = await db.collection('users').doc(this.currentUserId)
        let currentEventRef = await db.collection('events').doc(this.$route.params['id'])
        let participantRef = await db.collection('participants')
          .where('userRef', '==', currentUserRef)
          .where('eventRef', '==', currentEventRef)
          .get();
        if (!participantRef.empty) {
          this.isParticipated = true;
        }
      }
    },
    firestore(){
      console.log("firestore")
      return {
        event: db.collection('events').doc(this.$route.params['id']),
        talks: db.collection('talks')
          .where('eventRef', '==', db.collection('events').doc(this.$route.params['id'])),
        participants: db.collection('participants')
          .where('eventRef', '==', db.collection('events').doc(this.$route.params['id'])),
      }
    },
    methods: {
      async deleteEvent() {
        var res = confirm('ほんとにイベントを取りやめますか？？？？？');
        if (res) {
          console.log('deleteEvent');
          let eventRef = await db.collection('events').doc(this.event.id); //参加イベントの参照オブジェクト

          await this.participants.forEach(user => {
            db.collection('users')
              .doc(user.id)
              .update({
                joinEvents: firebase.firestore.FieldValue.arrayRemove(eventRef)
              })
          });
          db.collection('events')
            .doc(this.$route.params['id'])
            .delete()
            .then(() => {
              this.$router.push({name: 'events'});
            })
            .catch(err => {
              console.error('Error deleting event data: ', err);
            });
        }
      },
      async participate() {
        let self = this;
        let userRef = await db.collection('users').doc(self.currentUserId); //ログインユーザーの参照オブジェクト
        let eventRef = await db.collection('events').doc(self.event.id); //参加イベントの参照オブジェクト
        db.collection('participants').add({
          userRef: userRef,
          eventRef: eventRef
        });
        this.isParticipated = true;
      },
      async cancelParticipate() {
        var res = confirm('ほんとに取りやめますか？？？？？');
        if (res) {
          this.isParticipated = false;
          let currentUserRef = await db.collection('users').doc(this.currentUserId)
          let currentEventRef = await db.collection('events').doc(this.$route.params['id'])
          db.collection('participants')
            .where('userRef', '==', currentUserRef)
            .where('eventRef', '==', currentEventRef)
            .get()
            .then(participants => {
              participants.forEach(participant =>{
                participant.ref.delete();
              })
            });
          db.collection('talks')
            .where('userRef', '==', currentUserRef)
            .where('eventRef', '==', currentEventRef)
            .get()
            .then(talks => {
              talks.forEach(talk =>{
                talk.ref.delete();
              })
            });
        }
        alert('次はないですよ');
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
