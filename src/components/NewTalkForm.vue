<template>
  <div class="new-talk-form">
    <v-icon
      id="talk-activator"
      @click:on="openDialog"
      color="blue"
      large>
      mdi-tooltip-plus
    </v-icon>
    <v-dialog
      v-model="dialog"
      activator="#talk-activator">
      <v-card>
        <v-card-title>
          <span class="headline">新規トーク作成</span>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-icon color="red" @click="hideDialog" large>mdi-close-circle</v-icon>
          </v-card-actions>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  ref="title"
                  v-model="title"
                  label="タイトル"
                  :rules="[requiredNotEmpty]" />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="movieUrl"
                  label="動画URL" />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="slideUrl"
                  label="スライドURL" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer>
            <v-btn color="blue darken-1" @click="createTalk">トーク作成</v-btn>
          </v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'

  export default {
    props: {
      eventId: String,
      userId: String,
    },
    data() {
      return {
        title: '',
        slideUrl: '',
        movieUrl: '',
        isValid: false,
        dialog: false
      };
    },
    watch: {
      title() {
        console.log('title: '+this.title);
      },
      slideUrl() {
        console.log('slideUrl: '+this.slideUrl);
      },
      movieUrl() {
        console.log('movieUrl: '+this.movieUrl);
      },
    },
    methods: {
      async createTalk() {
        if (this.isValid) {
          let eventRef = await db.collection('events').doc(this.eventId)
          let userRef = await db.collection('users').doc(this.userId)
          db.collection('talks')
            .add({
              eventRef: eventRef,
              userRef: userRef,
              title: this.title,
              slideUrl: this.slideUrl,
              movieUrl: this.movieUrl,
              createdTime: firebase.firestore.FieldValue.serverTimestamp(),
              updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log(`Talk ${this.title} was created.`);
              this.hideDialog();
              //this.$router.go(this.$router.currentRoute);
            })
            .catch(err => {
              console.error(`Error occurd in createTalk: ${err}`);
            });
        } else {
          console.log('Error occurred on validation.');
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
        this.$refs.title.reset()
        this.title = '';
        this.movieUrl = '';
        this.slideUrl = '';
        this.isValid =  false;
      },
      // Formダイアログの表示
      openDialog() {
        this.dialog = true
      },
      // Formダイアログの非表示
      hideDialog() {
        this.clear();
        this.dialog= false;
      },
    }
  };
</script>
<style scoped>
</style>
