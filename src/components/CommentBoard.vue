<template>
  <div>
    <v-card
      v-scroll.self="onScroll"
      class="overflow-y-auto"
      max-height="400"
    >
      <v-list three-line>
        <template v-for="(comment, index) in comments">
          <v-list-item
            :key="index"
          >
            <v-list-item-avatar @click="goUserPage(comment.userRef)">
              <img :src="comment.userRef.photoURL">
            </v-list-item-avatar>

            {{comment.userRef.name}}

            <v-list-item-content>
              <v-list-item-title>{{comment.content}}</v-list-item-title>
              <v-list-item-subtitle v-if="comment.createdTime">
                {{getStringFromDate(comment.createdTime.toDate())}}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
            </v-list-item-action>
            <v-icon v-if="currentUserId == comment.userRef.id" color="red" @click="deleteComment(comment.id)">
              mdi-delete
            </v-icon>
          </v-list-item>

          <v-divider :key="comment.id"></v-divider>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<script>
  import { db } from '@/firebase/firestore.js';
  import firebase from 'firebase';

  export default {
    name: 'CommentBoard',
    props: {
      talkId: {
        type: String
      }
    },
    data: () => ({
      comments: [],
      scrollInvoked: 0,
      currentUserId: ''
    }),
    created() {
      let self = this;
      firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
          self.currentUserId = user.uid;
        }
      });
    },
    firestore() {
      return {
        // firestoreのcommentsコレクションを参照
        comments: db.collection('talks').doc(this.talkId).collection('comments').orderBy('createdTime', 'desc')
      }
    },
    methods: {
      deleteComment(id) {
        if (!confirm('コメントを削除してよろしいですか？')) {
          return
        }
        db.collection('talks').doc(this.talkId).collection('comments').doc(id).delete()
      },
      goUserPage(userRef) {
        this.$router.push({ name : 'user', params: { uid: userRef.id}});
      },
      onScroll () {
        this.scrollInvoked++
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
    },
  }
</script>
