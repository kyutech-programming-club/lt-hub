<template>
  <div>
    <h1>Chat Board !!</h1>
    <v-list three-line>
      <template v-for="(comment, index) in comments">
        <v-list-item
          :key="index"
        >
          <v-avatar @click="goUserPage(comment.userRef)">
            <img :src="comment.userRef.photoURL">
          </v-avatar>

          <v-list-item-content>
            <v-list-item-subtitle class="text--primary subheading">{{comment.content}}</v-list-item-subtitle>
            <v-list-item-subtitle>
              {{comment.createdAt.toDate().toLocaleString()}}
              <v-icon color="red" @click="deleteComment(comment.id)" small>delete</v-icon>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="comment.id"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
  import { db } from '@/firebase/firestore.js';
  export default {
    name: "ChatBoard",
    props: {
      talkId: {
        type: String
      }
    },
    data: () => ({
      comments: [],
    }),
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
      }
    },
  }
</script>