<template>
  <div class="event">
    <div v-if="event.id">
      <div>
        <h1>{{ event.title }}</h1>
        期間：{{ event.start }} ~ {{ event.end }}<br>
        場所：{{ event.place }}<br>
        作成日時：{{ getStringFromDate(event.createdTime.toDate()) }}<br>
        最終更新日時：{{ getStringFromDate(event.updatedTime.toDate()) }}
      </div>
      <div v-if="event.author.id">
        責任者：
        <user-item-small
          :user = "event.author" />
      </div>
    </div>
    <!--    <div v-if="isAuthor">-->
    <!--      <v-expansion-panels>-->
    <!--        <v-expansion-panel>-->
    <!--          <v-expansion-panel-header>-->
    <!--            <v-card-title>-->
    <!--              <v-toolbar :flat="true">-->
    <!--                <v-toolbar-title class="mx-autoi">-->
    <!--                  Edit-->
    <!--                </v-toolbar-title>-->
    <!--              </v-toolbar>-->
    <!--            </v-card-title>-->
    <!--          </v-expansion-panel-header>-->
    <!--          <v-expansion-panel-content>-->
    <!--            <edit-event-form :event="event"/>-->
    <!--          </v-expansion-panel-content>-->
    <!--        </v-expansion-panel>-->
    <!--      </v-expansion-panels>-->
    <!--      <v-btn class="white&#45;&#45;text font-weight-bold" color="#ff4b4b" @click="deleteEvent">-->
    <!--        Delete-->
    <!--      </v-btn>-->
    <!--    </div>-->
    <!--    <div v-if="participated">-->
    <!--      <v-btn class="white&#45;&#45;text font-weight-bold" color="#ff4b4b" @click="cancelParticipate">-->
    <!--        参加取り消し-->
    <!--      </v-btn>-->
    <!--      <v-expansion-panels>-->
    <!--        <v-expansion-panel>-->
    <!--          <v-expansion-panel-header>-->
    <!--            <v-card-title>-->
    <!--              <v-toolbar :flat="true">-->
    <!--                <v-toolbar-title class="mx-autoi">-->
    <!--                  トーク新規作成-->
    <!--                </v-toolbar-title>-->
    <!--              </v-toolbar>-->
    <!--            </v-card-title>-->
    <!--          </v-expansion-panel-header>-->
    <!--          <v-expansion-panel-content>-->
    <!--            <new-talk-form-->
    <!--              :eventId="event.id"/>-->
    <!--          </v-expansion-panel-content>-->
    <!--        </v-expansion-panel>-->
    <!--      </v-expansion-panels>-->
    <!--    </div>-->
    <!--    <div v-else-if="currentUserId">-->
    <!--      <v-btn-->
    <!--        class="white&#45;&#45;text font-weight-bold"-->
    <!--        color="#009eff"-->
    <!--        @click="participate">-->
    <!--        参加-->
    <!--      </v-btn>-->
    <!--    </div>-->

    <div class="talks-list">
      <talk-item
        v-for="talk in talks"
        :key="talk.id"
        :talk="talk"
        :talkUser="talk.talkUser"/>
    </div>
    <!--    <div v-if="participants.length" class="users-list">-->
    <!--      参加者リスト<br>-->
    <!--      <user-item-small-->
    <!--        v-for="user in participants"-->
    <!--        :key="user.id"-->
    <!--        :user="user" />-->
    <!--    </div>-->
  </div>
</template>

<script>
  // import firebase from 'firebase'
  // import EditEventForm from '@/components/EditEventForm.vue'
  // import NewTalkForm from '@/components/NewTalkForm.vue'
  import UserItemSmall from '@/components/UserItemSmall.vue'
  import TalkItem from '@/components/TalkItem.vue'
  import { db } from '@/firebase/firestore.js'

  export default {
    name: 'Event',
    components: {
      // EditEventForm,
      UserItemSmall,
      TalkItem,
      // NewTalkForm,
    },
    data() {
      return {
        event: [],
        talks: [],
        author: {},
        currentUserId: '',
        participants: [],
        participated: false,
        isAuthor: false,
      }
    },
    created() {
      // console.dir(this.event);
      // let self = this;
      // console.log('Event Page');
      // firebase.auth().onAuthStateChanged(user => {
      //   if (user != null) {
      //     self.currentUserId = user.uid;
      //   }
      // });
      // let eventRef = db.collection('events').doc(this.$route.params['id']);
      // eventRef
      //   .get()
      //   .then(event => {
      //     if (event.exists) {
      //       db.collection('talks').where('eventRef', '==', eventRef).get().then(talks => {
      //         talks.forEach(async(talk) => {
      //           // console.log(talk.id);
      //           // console.log(talk.data());
      //           let talkUser = await talk.data().userRef.get();
      //           self.talks.push(
      //             {
      //               id: talk.id,
      //               data: talk.data(),
      //               talkUser: {
      //                 id: talkUser.id,
      //                 data: talkUser.data()
      //               }
      //             }
      //           );
      //         });
      //       });
      //       console.log('Successfully fetched event data');
      //       // console.log(JSON.stringify(event.data()));
      //       self.event = {
      //         id: event.id,
      //         data: event.data()
      //       }
      //       if (event.data().author == self.currentUserId) {
      //         self.isAuthor = true;
      //       }
      //       if (event.data().participants.length) {
      //         event.data().participants.forEach( async(userRef) => {
      //           let user = await userRef.get();//参照型からデータの取得は非同期
      //           self.participants.push({
      //             id: user.id,
      //             data: user.data()
      //           });
      //           if (user.id == self.currentUserId) {
      //             self.participated = true;
      //           }
      //         });
      //       }
      //
      //       db.collection('users')
      //         .doc(event.data().author)
      //         .get()
      //         .then(author => {
      //           if (author != null) {
      //             self.author = {
      //               id: author.id,
      //               data: author.data()
      //             }
      //           }
      //         })
      //         .catch(err => {
      //           console.error('Error fetching author data: ', err);
      //         });
      //
      //     } else {
      //       console.error('Error fetching event data');
      //       self.event = {};
      //     }
      //   })
      //   .catch(err => {
      //     console.error('Error fetching event data: ', err);
      //   });

    },
    firestore(){
      return {
        event: db.collection('events').doc(this.$route.params['id']),
        talks: db.collection('talks')
          .where('eventRef', '==', db.collection('events').doc(this.$route.params['id']))
          // .orderBy('createdTime', 'desc')
      }
    },
    methods: {
      //   goUserPage() {
      //     console.log('goUserPage');
      //     this.$router.push({ name : 'user', params: { uid: this.author.id}});
      //   },
      //   async deleteEvent() {
      //     var res = confirm('ほんとにイベントを取りやめますか？？？？？');
      //     if (res) {
      //       console.log('deleteEvent');
      //       let eventRef = await db.collection('events').doc(this.event.id); //参加イベントの参照オブジェクト
      //
      //       await this.participants.forEach( user => {
      //         db.collection('users')
      //           .doc(user.id)
      //           .update({
      //             joinEvents: firebase.firestore.FieldValue.arrayRemove(eventRef)
      //           })
      //       });
      //       db.collection('events')
      //         .doc(this.$route.params['id'])
      //         .delete()
      //         .then(() => {
      //           this.$router.push({ name : 'events'});
      //         })
      //         .catch(err => {
      //           console.error('Error deleting event data: ', err);
      //         });
      //     }
      //   },
      //   async participate() {
      //     try {
      //       let self = this;
      //       let userRef = await db.collection('users').doc(self.currentUserId); //ログインユーザーの参照オブジェクト
      //       let eventRef = await db.collection('events').doc(self.event.id); //参加イベントの参照オブジェクト
      //       await userRef.update({
      //         joinEvents: firebase.firestore.FieldValue.arrayUnion(eventRef)
      //       });
      //       await eventRef.update({
      //         participants: firebase.firestore.FieldValue.arrayUnion(userRef)
      //       });
      //       console.log('participants registered');
      //       this.$router.go(this.$router.currentRoute);
      //     } catch (err) {
      //       console.log(err);
      //     }
      //   },
      //   async cancelParticipate() {
      //     var res = confirm('ほんとに取りやめますか？？？？？');
      //     if (res) {
      //       try {
      //         let self = this;
      //         let userRef = await db.collection('users').doc(self.currentUserId); //ログインユーザーの参照オブジェクト
      //         let eventRef = await db.collection('events').doc(self.event.id); //参加イベントの参照オブジェクト
      //         await userRef.update({
      //           joinEvents: firebase.firestore.FieldValue.arrayRemove(eventRef)
      //         });
      //         await eventRef.update({
      //           participants: firebase.firestore.FieldValue.arrayRemove(userRef)
      //         });
      //         let talkRefs = await db.collection('talks').where('eventRef', '==', eventRef).where('userRef', '==', userRef);
      //         await talkRefs
      //           .get()
      //           .then(talks => {
      //             talks.forEach(talk => {
      //               talk.ref.delete().then(() => {
      //                 console.log('delete!');
      //               });
      //             });
      //           });
      //         alert('次はないですよ');
      //         this.$router.go(this.$router.currentRoute);
      //       } catch (err) {
      //         console.log(err);
      //       }
      //     }
      //   },
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

        var format_str = 'YYYY-MM-DD hh:mm:ss';
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
