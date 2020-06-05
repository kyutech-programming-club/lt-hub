<template>
  <div class="event">
    <h1>Event Page</h1>
    <div v-if="event.id">
      <h2>{{ event.data.title }}</h2>
      期間：{{ event.data.start }} ~ {{ event.data.end }}<br>
      場所：{{ event.data.place }}<br>
      作成日時：{{ getStringFromDate(event.data.createTime.toDate()) }}<br>
      最終更新日時：{{ getStringFromDate(event.data.updateTime.toDate()) }}
    </div>
    <div v-if="author.id">
      責任者：
      <v-btn @click="goUserPage">
        {{ author.data.name }}
      </v-btn>
    </div>
    <div v-if="participated">
      <v-chip>
        参加済み
      </v-chip>
    </div>
    <div v-else>
      <v-btn @click="participate">
        参加
      </v-btn>
    </div>
    <div v-if="current">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-card-title>
              <v-toolbar :flat="true">
                <v-toolbar-title class="mx-autoi">
                  Edit
                </v-toolbar-title>
              </v-toolbar>
            </v-card-title>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <edit-event-form :event="event"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-btn @click="deleteEvent">
        Delete
      </v-btn>
    </div>
    <div class="users-list">
      参加者リスト
      <user-item
        v-for="user in participants"
        :key="user.id"
        :user="user" />
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import EditEventForm from '@/components/EditEventForm.vue'
  import UserItem from '@/components/UserItem.vue'
  import { db } from '@/firebase/firestore.js'

  export default {
    name: 'Event',
    components: {
      EditEventForm,
      UserItem
    },
    data() {
      return {
        event: {},
        author: {},
        current: false,
        participants: [],
        participated: false
      }
    },
    created() {
      let self = this
      console.log('Event Page');
      db.collection('events')
        .doc(this.$route.params['id'])
        .get()
        .then(event => {
          if (event.exists) {
            console.log('Successfully fetched event data');
            // console.log(JSON.stringify(event.data()));
            self.event = {
              id: event.id,
              data: event.data()
            };

            if (event.data().participants.length) {
                event.data().participants.forEach( async(userRef) => {
                    let user = await userRef.get();//参照型からデータの取得は非同期
                    self.participants.push({
                        id: user.id,
                        data: user.data()
                    });
                    await firebase.auth().onAuthStateChanged(currentUser => {
                        if (user.id == currentUser.uid) {
                          self.participated = true;
                        }
                    });
                });
            }

            db.collection('users')
              .doc(event.data().author)
              .get()
              .then(author => {
                if (author != null) {
                  self.author = {
                    id: author.id,
                    data: author.data()
                  }
                }
              })
              .catch(err => {
                console.error('Error fetching author data: ', err);
              });

            firebase.auth().onAuthStateChanged(user => {
              if (user != null && user.uid == event.data().author) {
                self.current = true;
              }
            });

          } else {
            console.error('Error fetching event data');
            self.event = {};
          }
        })
        .catch(err => {
          console.error('Error fetching event data: ', err);
        });
    },
    methods: {
      goUserPage() {
        console.log('goUserPage');
        this.$router.push({ name : 'user', params: { uid: this.author.id}});
      },
      deleteEvent() {
        console.log('deleteEvent');
        db.collection('events')
          .doc(this.$route.params['id'])
          .delete()
          .then(() => {
            this.$router.push({ name : 'events'});
          })
          .catch(err => {
            console.error('Error deleting event data: ', err);
          });
      },
      async participate() {
        try {
          let userId;
          await firebase.auth().onAuthStateChanged(user => {
            console.log('userId: ' + user.uid);
            userId =  user.uid;
          });
          let userRef = await db.collection('users').doc(userId); //ログインユーザーの参照オブジェクト
          let self = this;
          await db.collection('events')
                  .doc(self.event.id)
                  .update({
                    //配列フィールドに新しく要素を追加、存在しなければ配列フィールドを作成
                    participants : firebase.firestore.FieldValue.arrayUnion(userRef)
                  });
          alert('Participated!');
          console.log('participants registered');
          this.$router.go(this.$router.currentRoute);
        } catch (err) {
          console.log(err);
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