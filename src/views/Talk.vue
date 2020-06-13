<template>
  <div class="talk">
    <div v-if="talkEvent">
      参加イベント：
      <v-btn color="#CBFFD3" @click="goEventPage">
        {{ talkEvent.title }}
      </v-btn><br>
    </div>
    <div v-if="talk.id">
      <h1>{{ talk.data.title }}</h1>
      作成日時：{{ getStringFromDate(talk.data.createdTime.toDate()) }}<br>
      最終更新日時：{{ getStringFromDate(talk.data.updatedTime.toDate()) }}<br>
      動画URL: {{ talk.data.movieUrl }}<br>
      スライドURL: {{ talk.data.slideUrl }}<br>
      登壇者：{{ talk.talkUser.data.name }}<br>
    </div>

    <div v-if="isTalker">
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
            <edit-talk-form :talk="talk"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-btn class="white--text font-weight-bold" color="#ff4b4b" @click="deleteTalk">
        Delete
      </v-btn>
    </div>
    
    <div v-if="talk.id">
      <div v-if="currentUserId">
        <ChatForm :talkId="talk.id" :userId="currentUserId"/>
      </div>
      <ChatBoard :talkId="talk.id"/>
    </div>
  </div>
</template>

<script>
  import EditTalkForm from '@/components/EditTalkForm.vue';
  import ChatBoard from '@/components/ChatBoard.vue'
  import ChatForm from '@/components/Form.vue'
  import { db } from '@/firebase/firestore.js';
  import firebase from 'firebase';

  export default {
    name: 'Talk',
    components: {
      EditTalkForm,
      ChatBoard,
      ChatForm
    },
    props: {
      talkData: {
        type: Object
      }, // 遷移元からのパラメータを取得
    },
    data() {
      return {
        talk: Object,
        currentUserId: '',
        isTalker: false,
        talkEvent: {}
      }
    },
    created() {
      let self = this;
      firebase.auth().onAuthStateChanged(async(user) => {
        let talkerId = await self.getTalk(self);
        if (user) {
          self.currentUserId = user.uid;
          await self.checkTalker(talkerId, user.uid);
        }
      });

    },
    methods: {
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
      },
      async getTalk(self) {
        if (self.talkData != null) {
          await self.$root.$set(this, 'talk', self.talkData);
          self.getEvent();
          return self.talkData.talkUser.id
        } else {
          let talkData = {}
          await db.collection('talks').doc(this.$route.params['id']).get()
            .then(async (talk) => {
              await talk.data().userRef.get().then(talkUser => {
                talkData =
                  {
                    id: talk.id,
                    data: talk.data(),
                    talkUser: {
                      id: talkUser.id,
                      data: talkUser.data()
                    }
                  };
                self.$root.$set(self, 'talk', talkData);
              });
            });
          self.getEvent();
          return talkData.talkUser.id
        }
      },
      checkTalker(talkerId, userId) {
        if (talkerId == userId) {
          this.isTalker = true;
        }
      },
      async getEvent() {
        let event = await this.talk.data.eventRef.get(); //参加イベントの参照オブジェクト
        this.talkEvent = {
          id: event.id,
          title: event.data().title
        }
      },
      async deleteTalk() {
        var res = confirm('ほんとに登壇を取りやめますか？？？？？');
        if (res) {
          let self = this;
          db.collection('talks')
            .doc(this.$route.params['id'])
            .delete()
            .then(() => {
              this.$router.push({ name : 'event', params: {id: self.talkEvent.id}});
            })
            .catch(err => {
              console.error('Error deleting event data: ', err);
            });
        }
      },
      goEventPage() {
        console.log('goEventPage');
        this.$router.push({ name : 'event', params: { id: this.talkEvent.id}});
      }
    }
  }
</script>

<style scoped>
</style>
