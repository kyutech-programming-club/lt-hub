<template>
  <div class="talk" v-if="talk !== null">
    <div v-if="talk.id">
      参加イベント：
      <v-btn color="#CBFFD3" @click="goEventPage">
        {{ talk.eventRef.title }}
      </v-btn><br>
    </div>
    <div v-if="talk.id">
      <h1>{{ talk.title }}</h1>
      <div v-if="talk.createdTime">
        作成日時：{{ getStringFromDate(talk.createdTime.toDate()) }}<br>
      </div>
      <div v-if="talk.updatedTime">
        最終更新日時：{{ getStringFromDate(talk.updatedTime.toDate()) }}<br>
      </div>
      <div v-if="talk.movieUrl != ''">
        <a :href="generateMovieLink" target="_blank">Youtubeで視聴</a><br>
        <EmbedMovie :movieUrl="talk.movieUrl"/>
      </div>
      <div v-if="talk.slideUrl != ''">
        <EmbedSlide :slideUrl="talk.slideUrl"/>
      </div>
      <div v-if="talk.userRef.id">
        登壇者：
        <user-item-small
          :user = "talk.userRef" />
        <div v-if="talk.userRef.id == currentUserId">
          <edit-talk-form :talk="talk"/>
          <v-chip
            class="ma-2"
            color="red"
            text-color="white"
            @click="deleteTalk">
            <v-icon left>
              mdi-delete
            </v-icon>
            Delete talk
          </v-chip>
        </div>
      </div>
    </div>
    <div v-if="talk.id">
      <v-chip
        v-if="nextTalkId !== null"
        class="ma-2"
        color="green"
        text-color="white"
        @click="goNextTalk">
        <v-icon left>
          mdi-comment-arrow-right
        </v-icon>
        Next talk
      </v-chip>
      <div v-if="currentUserId">
        <CommentForm :talkId="talk.id" :userId="currentUserId"/>
      </div>
      <CommentBoard :talkId="talk.id"/>
    </div>
  </div>
</template>

<script>
  import EditTalkForm from '@/components/EditTalkForm.vue'
  import CommentBoard from '@/components/CommentBoard.vue'
  import CommentForm from '@/components/CommentForm.vue'
  import EmbedMovie from '@/components/EmbedMovie.vue'
  import EmbedSlide from '@/components/EmbedSlide.vue'
  import { db } from '@/firebase/firestore.js'
  import firebase from 'firebase'
  import UserItemSmall from "../components/UserItemSmall"

  export default {
    name: 'Talk',
    components: {
      UserItemSmall,
      EditTalkForm,
      CommentBoard,
      CommentForm,
      EmbedMovie,
      EmbedSlide
    },
    data() {
      return {
        talk: null,
        currentUserId: '',
        nextTalkId: null
        // isTalker: false,
        // talkEvent: {}
      }
    },
    created() {
      let self = this;
      firebase.auth().onAuthStateChanged(async(user) => {
        if (user != null) {
          this.$root.$set(self, 'currentUserId', user.uid);
        }
      });
    },
    computed: {
      generateMovieLink() {
        return "https://www.youtube.com/watch?v=" + this.talk.movieUrl
      }
    },
    firestore(){
      return {
        talk: db.collection('talks').doc(this.$route.params['id'])
      }
    },
    watch: {
      async talk(talkData) {
        let eRef = await talkData.eventRef;
        let eventSort = await db.doc(eRef).get().then((event) => {return event.data().sort})
        this.nextTalkId = this.nextTalkIdFinder(talkData.id, eventSort)
      }
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
      async deleteTalk() {
        var res = confirm('やめちゃうの…？');
        if (res) {
          let eRef = await db.collection('events').doc(this.talk.eventRef.id)

          await eRef.update({
            sort: firebase.firestore.FieldValue.arrayRemove(this.talk.id)
          })

          db.collection('talks')
            .doc(this.$route.params['id'])
            .delete()
            .then(() => {
              this.$router.push({ name : 'event', params: {id: eRef.id}});
            })
            .catch(err => {
              console.error('Error deleting talk data: ', err);
            });
          alert('ぱおん')
        } else {
          alert('焦った〜！');
        }
      },
      goEventPage() {
        console.log('goEventPage');
        this.$router.push({ name : 'event', params: { id: this.talk.eventRef.id}});
      },
      nextTalkIdFinder(talkId, eventSortData) {
        let nextTalkPos = eventSortData.indexOf(talkId) + 1
        if (nextTalkPos === eventSortData.length) {
          return null
        }
        return eventSortData[nextTalkPos]
      },
      goNextTalk() {
        this.$router.push({ name : 'talk', params: { id: this.nextTalkId}});
        this.$router.go()
      },
    }
  }
</script>

<style scoped>
  .iframe-wrap {
    position: relative;
    overflow: hidden;
    margin: 15px 0 20px 0;
    padding-bottom: 50%;
    padding-top: 65px;
  }
  .iframe-wrap >>> iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
