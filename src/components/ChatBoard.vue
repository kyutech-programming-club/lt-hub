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
              <v-list-title>{{comment.content}}</v-list-title>
              <v-list-item-subtitle>
                {{comment.createdAt.toDate().toLocaleString()}}
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
    name: 'ChatBoard',
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
        comments: db.collection('talks').doc(this.talkId).collection('comments').orderBy('createdAt', 'desc')
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
    },
  }
</script>
