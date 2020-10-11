<template>
  <div class="event">
    <div v-if="event.id">
      <div>
        <h1>{{ event.title }}</h1>
        <div v-if="event.start">
          期間：{{ getStringFromDate(this.event.start.toDate()).substr(0,16) }} ~ {{ getStringFromDate(this.event.end.toDate()).substr(0,16) }}<br>
        </div>
        概要
        <v-card
          v-scroll.self="onScroll"
          class="overflow-y-auto reline"
          max-height="400"
          flat>
          {{event.description}}<br>
        </v-card>
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
          <edit-event-form
            v-if="isBeforeEvent"
            :event="event"/>
          <v-chip
            class="ma-2"
            color="red"
            text-color="white"
            @click="deleteEvent">
            <v-icon left>
              mdi-delete
            </v-icon>
            Delete event
          </v-chip>
        </div>
      </div>
    </div>
    <div v-if="isBeforeEvent && currentUserId">
      <div  v-if="isParticipated">
        <v-btn class="white--text font-weight-bold" color="#ff4b4b" @click="cancelParticipate">
          Cancel
        </v-btn>
        <new-talk-form
          :eventId="event.id"
          :userId="currentUserId"/>
      </div>
      <div v-else>
        <v-btn
          class="white--text font-weight-bold"
          color="#009eff"
          @click="participate">
          Join
        </v-btn>
      </div>
    </div>
    <v-chip
      class="ma-2"
      color="green"
      text-color="white"
      @click="saveEventOrder">
    <v-icon left>
      mdi-account-switch
    </v-icon>
      Save order
  </v-chip>
    <div class="talks-list">
      LT数 {{event.sort.length}}
      <draggable
        :list="orderItem"
      >
      <talk-item
        v-for="talkId in orderItem"
        :key="talkId"
        :talkId="talkId" />
      </draggable>
    </div>
    <div v-if="participants" class="users-list">
      参加者数  {{participants.length}}人<br />
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
  import draggable from 'vuedraggable';

  export default {
    name: 'Event',
    components: {
      ParticipateItem,
      EditEventForm,
      UserItemSmall,
      TalkItem,
      NewTalkForm,
      draggable,
    },
    data() {
      return {
        event: [],
        participants: [],
        isParticipated: false,
        author: {},
        currentUserId: '',
        participated: false,
        isAuthor: false,
        isBeforeEvent: false,
        orderItem: []
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
        if (this.currentUserId != '') {
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
        let now = new Date();
        if (this.event.end.toDate() > now) {
          this.isBeforeEvent = true;
        }
        this.orderItem = await this.event.sort
      },
    },
    firestore(){
      console.log("firestore");
      return {
        event: db.collection('events').doc(this.$route.params['id']),
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
          db.collection('participants').where('eventRef', '==', eventRef)
            .get()
            .then(participants =>{
              participants.forEach(participant => {
                participant.ref.delete();
              })
            });

          db.collection('talks').where('eventRef', '==', eventRef)
            .get()
            .then(talks =>{
              talks.forEach(talk => {
                talk.ref.delete();
              })
            });

          eventRef
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
        var res = confirm('参加を取り消しますか？');
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
          alert('ぴえん');
        } else {
          alert('命拾いしましたね');
        }
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
      },
      onScroll () {
        this.scrollInvoked++
      },
      saveEventOrder() {
        console.log(this.orderItem)
      }
    }
  }
</script>

<style scoped>
  .reline {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
</style>
