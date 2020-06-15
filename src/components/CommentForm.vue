<template>
  <div>
    <v-card
      color="blue-grey lighten-5"
      :hover="true"
    >
      <v-container>
        <v-form ref="form" v-model="isValid" lazy-validation @submit.prevent>
          <v-row no-gutters>
            <v-col
              :cols="11">
              <v-textarea
                ref="textarea"
                @keydown.enter.exact.prevent
                @keyup.enter.exact="addComment"
                @blur="clear"
                v-model="inputComment"
                :rules="[requiredNotEmpty]"
                label="コメント"
                hint="Shift + Enter で改行"
                :row-height="1"
                :auto-grow="true"
                :persistent-hint="true"
                required
              ></v-textarea>
            </v-col>
            <v-col
              :cols="1">
              <v-icon
                class="mt-5"
                color="blue"
                :disabled="!isValid"
                @click="addComment"
              >mdi-send</v-icon>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>

  </div>
</template>

<script>
  import firebase from 'firebase'
  import {db} from '@/firebase/firestore.js';

  export default {
    name: 'CreateForm',
    props: {
      talkId: {
        type: String
      },
      userId: {
        type: String
      }
    },
    data: () => ({
      // form入力データ
      inputComment: '',
      // バリデーション
      isValid: false,
      // Formダイアログの表示可否
      displayForm: false,
    }),
    methods: {
      // コメント追加
      async addComment() {
        if (this.isValid) {
          let userRef = await db.collection('users').doc(this.userId);
          // コメントをFirestoreへ登録
          db.collection('talks').doc(this.talkId).collection('comments').add({
            content: this.inputComment,
            userRef: userRef,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
          });
          this.clear();
        }
      },
      requiredNotEmpty(value) {
        if (value == null) {
          this.isValid = false;
          return 'Required.';
        }
        //イベント名のみ入力必須項目
        const spaceRemoved = value.replace(/\s/g, '');
        if (!spaceRemoved) {
          this.isValid = false;
          return 'Required.';
        }
        this.isValid = true;
        return true;
      },
      // Formの初期化
      clear() {
        this.$refs.form.reset()
        this.inputComment='';
      },
    },
  }
</script>
