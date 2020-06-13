<template>
  <div>
    <h1>Chat Board !!</h1>
    <v-list three-line>
      <template v-for="(comment, index) in comments">
        <v-list-item
          :key="index"
          avatar
        >
          <v-list-item-avatar>
            <img :src="comment.avatar">
          </v-list-item-avatar>

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
    data: () => ({
      comments: [],
    }),
    firestore() {
      return {
        // firestoreのcommentsコレクションを参照
        comments: db.collection('comments').orderBy('createdAt')

      }
    },
    methods: {
      deleteComment(id) {
        if (!confirm('コメントを削除してよろしいですか？')) {
          return
        }
        db.collection('comments').doc(id).delete()
      },
    },
  }
</script>