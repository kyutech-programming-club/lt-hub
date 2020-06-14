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

              <v-dialog
                ref="dialog1"
                v-model="modal"
                :return-value.sync="startDate"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDate"
                    label="開始日"
                    prepend-icon="mdi-event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="startDate" :max="endDate">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.dialog1.save(startDate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>

              <v-dialog
                ref="dialog2"
                v-model="modal1"
                :return-value.sync="startTime"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startTime"
                    label="開始時間"
                    prepend-icon="mdi-clock-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="modal1"
                  v-model="startTime"
                  full-width
                  :max="maxTime"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal1 = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.dialog2.save(startTime)">OK</v-btn>
                </v-time-picker>
              </v-dialog>

              <v-dialog
                ref="dialog3"
                v-model="modal3"
                :return-value.sync="endDate"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    label="終了日"
                    prepend-icon="mdi-event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="endDate" :min="startDate" >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal3 = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.dialog3.save(endDate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>

              <v-dialog
                ref="dialog4"
                v-model="modal2"
                :return-value.sync="endTime"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endTime"
                    label="終了時間"
                    prepend-icon="mdi-clock-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="modal2"
                  v-model="endTime"
                  full-width
                  :min="minTime"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.dialog4.save(endTime)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
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

  export default {
    data() {
      return {
        title: '',
        description: '',
        place: '',
        isValid: false,
        dialog: false,
        modal: false,
        modal1: false,
        modal2: false,
        modal3: false,
        startTime: null,
        endTime: null,
        startDate: '',
        endDate: '',
        minTime: '',
        maxTime: '',
      };
    },
    watch: {
      title() {
        console.log('title: '+this.title);
      },
      description() {
        console.log('description: '+this.description);
      },
      place() {
        console.log('place: '+this.place);
      },
      modal1() {
        console.log('modal1: '+this.modal1);
      },
      modal2() {
        console.log('modal2: '+this.modal2);
      },
      startTime() {
        console.log('startTime: '+this.startTime);
        if (this.startDate == this.endDate) {
          this.minTime = this.startTime;
        }
      },
      endTime() {
        console.log('endTime: '+this.endTime);
        if (this.startDate == this.endDate) {
          this.maxTime = this.endTime;
        }
      },
      endDate() {
        console.log('endDate: '+this.endDate);
        if (this.endDate != this.startDate) {
          this.maxTime = '';
          this.minTime = '';
        }
      },
      startDate() {
        console.log('startDate: '+this.startDate);
        this.endDate = this.startDate;
        if (this.endTime < this.startTime) {
          this.endTime = '';
          this.minTime = this.startTime
        }
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
                start: firebase.firestore.Timestamp.fromDate(new Date(this.startDate.split('-').join('/') + ' ' + this.startTime)),
                end: firebase.firestore.Timestamp.fromDate(new Date(this.endDate.split('-').join('/') + ' ' + this.endTime)),
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
        this.startDate = '';
        this.endDate = '';
        this.startTime = '';
        this.endTime = '';
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
