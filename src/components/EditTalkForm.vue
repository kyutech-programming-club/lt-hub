<template>
  <div class="new-talk-form">
    <v-chip
      class="ma-2"
      id="talk-activator"
      @click:on="openDialog"
      color="blue"
      text-color="white">
      <v-icon>
        mdi-pencil
      </v-icon>
    </v-chip>
    <v-dialog
      v-model="dialog"
      activator="#talk-activator"
      max-width="90%">
      <v-card>
        <v-card-title>
          <span class="headline">トーク編集</span>
          <help-of-slide class="pl-6"></help-of-slide>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-icon color="red" @click="hideDialog" large>mdi-close-circle</v-icon>
          </v-card-actions>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
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
                    label="スライドURL"
                    :rules="[requireValidSlideUrl]" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
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
  import { db } from '@/firebase/firestore.js'
  import HelpOfSlide from '@/components/HelpOfSlide.vue'

  export default {
    components: {
      HelpOfSlide
    },
    props: {
      talk: Object
    },
    data() {
      let movieUrl = ''
      if (this.talk.movieUrl != '') {
        movieUrl = 'https://www.youtube.com/watch?v=' + this.talk.movieUrl;
      }
      let slideUrl = ''
      if (this.talk.slideUrl != '') {
        slideUrl = 'https://docs.google.com/presentation/d/e/' + this.talk.slideUrl;
      }
      return {
        title: this.talk.title,
        slideUrl: slideUrl,
        movieUrl: movieUrl,
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
        if (this.$refs.form.validate()) {
          db.collection('talks')
            .doc(this.talk.id)
            .update({
              title: this.title,
              slideUrl: this.getSlideId(this.slideUrl),
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
          return 'Required.';
        }
        //イベント名のみ入力必須項目
        const spaceRemoved = value.replace(/\s/g, '');
        if (!spaceRemoved) {
          return 'Required.';
        }
        return true;
      },
      requireValidMovieUrl(value) {
        if (value.indexOf('watch?v=') != -1 || value.indexOf('youtu.be/') != -1 || value == '') {
          return true;
        }
        return 'Invalid url.';
      },
      requireValidSlideUrl(value) {
        if (value.indexOf('https://docs.google.com/presentation/d/e/') != -1 || value == '') {
          return true;
        }
        return 'Invalid url'
      },
      // Formの初期化
      clear() {
        this.title = this.talk.title;
        if (this.talk.movieUrl == '') {
          this.movieUrl = '';
        } else {
          this.movieUrl = 'https://www.youtube.com/watch?v=' + this.talk.movieUrl;
        }
        if (this.talk.slideUrl == '') {
          this.slideUrl = '';
        } else {
          this.slideUrl = 'https://docs.google.com/presentation/d/e/' + this.talk.movieUrl;
        }
        this.slideUrl = this.talk.slideUrl;
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
          url_str = url.slice( idx + 9 );
          if (url_str.indexOf('&') != -1) {
            and_idx = url_str.indexOf('&');
            url_str = url_str.substr(0, and_idx);
          }
          return url_str;
        }

        return url;
      },
      getSlideId(url) {
        url = url.replace('https://docs.google.com/presentation/d/e/', '');
        url = url.replace(/\/pub\?.*/, '');
        return url;
      }
    }
  };
</script>
<style scoped>
</style>
