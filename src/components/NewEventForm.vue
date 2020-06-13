<template>
  <div class="new-item-form">
    <v-icon
      id="activator"
      @click:on="openDialog"
      color="blue"
      large>
      mdi-plus-box-multiple
    </v-icon>
    <v-dialog
      v-model="dialog"
      activator="#activator"
      fullscreen>
      <v-card>
        <v-card-title>
          <span class="headline">新規イベント作成</span>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-icon color="red" @click="hideDialog" large>mdi-close-circle</v-icon>
          </v-card-actions>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <vue-ctk-date-time-picker
                  id="start"
                  label="開始日時を選択"
                  :format="'YYYY-MM-DD HH:mm'"
                  :max-date="end"
                  v-model="start" />
              </v-flex>
              <v-flex xs12 sm6 md6>
                <vue-ctk-date-time-picker
                  id="end"
                  label="終了日時を選択"
                  :format="'YYYY-MM-DD HH:mm'"
                  :min-date="start"
                  v-model="end" />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  ref="title"
                  v-model="title"
                  label="イベント名"
                  :rules="[requiredNotEmpty]"/>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="description"
                  label="イベント概要" />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="place"
                  label="会場"
                  hint="オンラインの場合は使用ツール・視聴URLなど"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer>
            <v-btn color="blue darken-1" @click="createEvent">イベント作成</v-btn>
          </v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

  export default {
    components: {
      VueCtkDateTimePicker
    },
    data() {
      return {
        title: '',
        description: '',
        start: '',
        end: '',
        place: '',
        isValid: false,
        dialog: false
      };
    },
    watch: {
      title() {
        console.log('title: '+this.title);
      },
      description() {
        console.log('description: '+this.description);
      },
      start() {
        console.log('start: '+this.start);
      },
      end() {
        console.log('end: '+this.end);
      },
      place() {
        console.log('place: '+this.place);
      },
    },
    methods: {
      async createEvent() {
        if (this.isValid) {
          firebase.auth().onAuthStateChanged(user => {
            db.collection('events')
              .add({
                title: this.title,
                description: this.description,
                author: db.collection('users').doc(user.uid),
                start: this.start,
                end: this.end,
                place: this.place,
                participants: [],
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                console.log(`Event ${this.title} was created.`);
                this.hideDialog();
                //this.$router.go(this.$router.currentRoute);
              })
              .catch(err => {
                console.error(`Error occurd in createEvent: ${err}`);
              });
          });
        } else {
          console.log('Error occurred on validation.');
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
        this.$refs.title.reset()
        this.title = '';
        this.description = '';
        this.start = '';
        this.end =  '';
        this.place =  '';
        this.isValid =  false;
      },
      // Formダイアログの表示
      openDialog() {
        this.dialog = true
      },
      //
      // Formダイアログの非表示
      hideDialog() {
        // if (!this.isValid) {
        //   this.clear();
        // }
        this.clear();
        this.dialog= false;
      },
    }
  };
</script>
<style scoped>
</style>
