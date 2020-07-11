<template>
  <div>
    <v-btn @click="backup" color="blue">Backup</v-btn>
    <v-btn @click="restore" color="orange">Restore</v-btn>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'
  export default {
    name: 'Backup.vue',
    methods: {
      async backup() {
        let backupData = {};
        let usersData = {};
        let eventsData = {};
        await db.collection('users').get().then(
          users => {
            users.forEach(user => {
                usersData[user.id] = user.data();
              }
            );
          }
        );

        await db.collection('events').get().then(
          events => {
            events.forEach(event => {
                eventsData[event.id] = {
                  title: event.data().title,
                  description: event.data().description,
                  author: event.data().author.id,
                  start: event.data().start,
                  end: event.data().end,
                  place: event.data().place,
                  createdTime: event.data().createdTime,
                  updatedTime: event.data().updatedTime,
                };
              }
            );
          }
        );

        console.log(eventsData);

        backupData['usersData'] = usersData;
        backupData['eventsData'] = eventsData;

        const fileName = 'backup.json';
        const data = JSON.stringify(backupData);
        const link = document.createElement('a');
        link.href = 'data:text/plain,' + encodeURIComponent(data);
        link.download = fileName;
        link.click();
      },
      restore() {
        const input = document.createElement('input');
        input.type = 'file';

        // ファイルが指定された後に行う処理を定義する。
        input.addEventListener('change', e => {
          // ファイルの中身
          let result = e.target.files[0];

          let reader = new FileReader();

          // ファイルの中身をテキストデータとして読み取る。
          reader.readAsText(result);

          // ファイルの中身が読み取られた後に行う処理を定義する。
          reader.addEventListener('load', () => {

            // 読み込んだデータ（JSON形式の文字列）をJavaScriptオブジェクトに変換する。
            this.save(JSON.parse(reader.result));
          });
        });

        // 「ファイルを開く」ダイアログを表示する。
        input.click();
      },
      save(data) {
        let usersData = data.usersData;
        let eventsData = data.eventsData;
        Object.keys(usersData).forEach(function (key) {
          db.collection('backupUsers').doc(key).set(
            {
              updatedTime: new firebase.firestore.Timestamp(
                usersData[key].updatedTime.seconds,
                usersData[key].updatedTime.nanoseconds
              ),
              createdTime: new firebase.firestore.Timestamp(
                usersData[key].createdTime.seconds,
                usersData[key].createdTime.nanoseconds
              ),
              name: usersData[key].name,
              photoURL: usersData[key].photoURL
            }
          );
        });

        Object.keys(eventsData).forEach(function (key) {
          db.collection('backupEvents').doc(key).set(
            {
              title: eventsData[key].title,
              description: eventsData[key].description,
              place: eventsData[key].place,
              author: db.collection('users').doc(eventsData[key].author),
              start: new firebase.firestore.Timestamp(
                eventsData[key].start.seconds,
                eventsData[key].start.nanoseconds
              ),
              end: new firebase.firestore.Timestamp(
                eventsData[key].end.seconds,
                eventsData[key].end.nanoseconds
              ),
              updatedTime: new firebase.firestore.Timestamp(
                eventsData[key].updatedTime.seconds,
                eventsData[key].updatedTime.nanoseconds
              ),
              createdTime: new firebase.firestore.Timestamp(
                eventsData[key].createdTime.seconds,
                eventsData[key].createdTime.nanoseconds
              ),
            }
          );
        });
      }
    },
  }
</script>

<style scoped>
</style>