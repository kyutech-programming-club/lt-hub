<template>
  <div class="new-item-form">
    <v-chip
      id="activator"
      color = "blue"
      text-color="white"
      @click:on="openDialog">
      <v-icon left>
        mdi-calendar-plus
      </v-icon>
      Create event
    </v-chip>
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
          <v-form ref="form">
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
                      :rules="[requiredNotEmpty]"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="startDate">
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
                      :rules="[requiredNotEmpty]"
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
                      :rules="[requiredNotEmpty, validEndDate]"
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
                      :rules="[requiredNotEmpty, validEndTime]"
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
                  <v-textarea
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer>
            <v-btn class="white--text font-weight-bold"
                   color="blue darken-1"
                   @click="createEvent">
              Create new event
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
    data() {
      return {
        title: '',
        description: '',
        place: '',
        dialog: false,
        modal: false,
        modal1: false,
        modal2: false,
        modal3: false,
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
        minTime: '',
        maxTime: '',
      };
    },
    created() {
      this.startDate = this.getStringFromDate(new Date());
      this.startTime = '19:00';

      this.endDate = this.getStringFromDate(new Date());
      this.endTime = '21:00';
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
    },
    methods: {
      async createEvent() {
        if (this.$refs.form.validate()) {
          firebase.auth().onAuthStateChanged(user => {
            db.collection('events')
              .add({
                title: this.title,
                description: this.description,
                author: db.collection('users').doc(user.uid),
                start: firebase.firestore.Timestamp.fromDate(new Date(this.startDate.split('-').join('/') + ' ' + this.startTime)),
                end: firebase.firestore.Timestamp.fromDate(new Date(this.endDate.split('-').join('/') + ' ' + this.endTime)),
                place: this.place,
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
      validEndDate() {
        if (this.endDate < this.startDate) {
          return 'Invalid.';
        }
        return true;
      },
      validEndTime() {
        const start = new Date(this.startDate.split('-').join('/') + ' ' + this.startTime)
        const end = new Date(this.endDate.split('-').join('/') + ' ' + this.endTime)
        console.log(start)
        console.log(end)
        if (end <= start) {
          return 'Invalid';
        }
        return true;
      },
      // Formの初期化
      clear() {
        this.$refs.title.reset()
        this.title = '';
        this.description = '';
        this.startDate = this.getStringFromDate(new Date());
        this.endDate = this.getStringFromDate(new Date());
        this.startTime = '19:00';
        this.endTime = '21:00';
        this.place =  '';
      },
      // Formダイアログの表示
      openDialog() {
        this.dialog = true
      },
      //
      // Formダイアログの非表示
      hideDialog() {
        this.clear();
        this.dialog= false;
      },
      //日付から文字列に変換する関数
      getStringFromDate(date) {
        var year_str = date.getFullYear();
        //月だけ+1すること
        var month_str = 1 + date.getMonth();
        var day_str = date.getDate();

        month_str = ('0' + month_str).slice(-2);
        day_str = ('0' + day_str).slice(-2);

        var format_str = 'YYYY-MM-DD';
        format_str = format_str.replace(/YYYY/g, year_str);
        format_str = format_str.replace(/MM/g, month_str);
        format_str = format_str.replace(/DD/g, day_str);

        return format_str;
      }
    }
  };
</script>
<style scoped>
</style>
