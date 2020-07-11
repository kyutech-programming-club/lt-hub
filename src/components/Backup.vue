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
        let backupData = {usersData: {}};
        let usersData = {};
        await db.collection('users').get().then(
          users => {
            users.forEach(user => {
                usersData[user.id] = user.data();
              }
            );
          }
        );
        backupData.usersData = usersData;

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
      }
    },
  }
</script>

<style scoped>
</style>