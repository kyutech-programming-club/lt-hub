<template>
  <div class="new-talk-form">
    <v-chip
      class="ma-2"
      id="talk-activator"
      @click:on="openDialog"
      color="blue"
      text-color="white">
      <v-icon left>
        mdi-pencil
      </v-icon>
      Edit talk
    </v-chip>
    <v-dialog
      v-model="dialog"
      activator="#talk-activator">
      <v-card>
        <v-card-title>
          <span class="headline">トーク編集</span>
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
                  label="動画URL"
                  :rules="[requireValidMovieUrl]" />
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
            <v-btn
              class="white--text font-weight-bold"
              color="blue darken-1"
              @click="updateTalk">
              Update talk
            </v-btn>
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
      talk: Object
    },
    data() {
      return {
        title: this.talk.title,
        slideUrl: this.talk.slideUrl,
        movieUrl: 'https://www.youtube.com/watch?v=' + this.talk.movieUrl,
        isValid: true,
        isValidMovieUrl: true, 
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
      async updateTalk() {
        if (this.isValid && this.isValidMovieUrl) {
          db.collection('talks')
            .doc(this.talk.id)
            .update({
              title: this.title,
              slideUrl: this.slideUrl,
              movieUrl: this.getMovieId(this.movieUrl),
              updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log(`Talk ${this.title} was updateed.`);
              this.hideDialog();
              //this.$router.go(this.$router.currentRoute);
            })
            .catch(err => {
              console.error(`Error occurd in updateTalk: ${err}`);
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
      requireValidMovieUrl(value) {
        if (value.indexOf('watch?v=') != -1 || value.indexOf('youtu.be/') != -1 || value == '') {
          this.isValidMovieUrl = true;
          return true;
        } 
        this.isValidMovieUrl = false;
        return 'Invalid url.';
      },
      // Formの初期化
      clear() {
        this.title = this.talk.title;
        this.movieUrl = 'https://www.youtube.com/watch?v=' + this.talk.movieUrl;
        this.slideUrl = this.talk.slideUrl;
        this.isValid = true;
        this.isValidMovieUrl = true;
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
      getMovieId(url) {
        let idx, url_str, and_idx;
        if (url.indexOf('watch?v=') != -1) {
          idx = url.indexOf('watch?v=');
          url_str = url.slice( idx + 8 );
          if (url_str.indexOf('&') != -1) {
            and_idx = url_str.indexOf('&');
            url_str = url_str.substr(0, and_idx);
          }
          return url_str;
        } else if (url.indexOf('youtu.be/') != -1) {
          idx = url.indexOf('youtu.be/');
          url_str = url.slice( idx + 8 );
          if (url_str.indexOf('&') != -1) {
            and_idx = url_str.indexOf('&');
            url_str = url_str.substr(0, and_idx);
          }
          return url_str;
        }

        return url;
      }
    }
  };
</script>
<style scoped>
</style>
