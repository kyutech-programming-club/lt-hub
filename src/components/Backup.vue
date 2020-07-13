<template>
  <div>
    <v-btn @click="backupWithoutComments" color="light-blue">Backup without comments</v-btn>
    <v-btn @click="backupOnlyComments" color="blue">Backup only comments</v-btn>
    <v-btn @click="restoreWithoutComments" color="pink">Restore without comments</v-btn>
    <v-btn @click="restoreOnlyComments" color="red">Restore only comments</v-btn>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'
  export default {
    name: 'Backup.vue',
    methods: {
      async backupWithoutComments() {
        let backupData = {};
        let usersData = {};
        let eventsData = {};
        let talksData = {};
        let participantsData = {};

        await db.collection('users').get().then(
          users => {
            users.forEach(user => {
              usersData[user.id] = user.data();
            });
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
            });
          }
        );

        await db.collection('talks').get().then(
          talks => {
            talks.forEach(talk => {
              talksData[talk.id] = {
                title: talk.data().title,
                movieUrl: talk.data().movieUrl,
                slideUrl: talk.data().slideUrl,
                userRef: talk.data().userRef.id,
                eventRef: talk.data().eventRef.id,
                createdTime: talk.data().createdTime,
                updatedTime: talk.data().updatedTime,
              };
            });
          }
        );

        await db.collection('participants').get().then(
          participants => {
            participants.forEach(participant => {
              participantsData[participant.id] = {
                userRef: participant.data().userRef.id,
                eventRef: participant.data().eventRef.id,
              };
            });
          }
        );

        backupData['usersData'] = usersData;
        backupData['eventsData'] = eventsData;
        backupData['talksData'] = talksData;
        backupData['participantsData'] = participantsData;

        const fileName = 'backupWithoutComments.json';
        const data = JSON.stringify(backupData);
        const link = document.createElement('a');
        link.href = 'data:text/plain,' + encodeURIComponent(data);
        link.download = fileName;
        link.click();
      },
      async backupOnlyComments() {
        let backupData = {};


        // let commentsData = {};
        // let talkIdList = [];

        // await db.collection('talks').get().then(
        //   talks => {
        //     talks.forEach(talk => {
        //       talkIdList.push(talk.id);
        //     });
        //   }
        // );

        // let commentsList = {};


        // ここら辺怪しい。
        // for (let i = 0; i < talkIdList.length; i++) {
        //   await db.collection('talks').doc(talkIdList[i]).collection('comments').get().then(
        //     comments => {
        //       comments.forEach(comment => {
        //         commentsList[comment.id] = {
        //           content: comment.data().content,
        //           favoriteNum: comment.data().favoriteNum,
        //           userRef: comment.data().userRef.id,
        //           createdTime: comment.data().createdTime
        //         }
        //       });
        //     }
        //   )

        //   commentsData[talkIdList[i]] = {
        //     comments: commentsList
        //   };

        // }

        // backupData['commentsData'] = commentsData;

        const fileName = 'backupOnlyComments.json';
        const data = JSON.stringify(backupData);
        const link = document.createElement('a');
        link.href = 'data:text/plain,' + encodeURIComponent(data);
        link.download = fileName;
        link.click();
      },
      restoreWithoutComments() {
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
            this.uploadWithoutComments(JSON.parse(reader.result));
          });
        });

        // 「ファイルを開く」ダイアログを表示する。
        input.click();
      },
      uploadWithoutComments(data) {
        let usersData = data.usersData;
        let eventsData = data.eventsData;
        let talksData = data.talksData;
        let participantsData = data.participantsData;

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

        Object.keys(talksData).forEach(function (key) {
          db.collection('backupTalks').doc(key).set(
            {
              title: talksData[key].title,
              userRef: db.collection('users').doc(talksData[key].userRef),
              eventRef: db.collection('events').doc(talksData[key].eventRef),
              movieUrl: talksData[key].movieUrl,
              slideUrl: talksData[key].slideUrl,
              updatedTime: new firebase.firestore.Timestamp(
                talksData[key].updatedTime.seconds,
                talksData[key].updatedTime.nanoseconds
              ),
              createdTime: new firebase.firestore.Timestamp(
                talksData[key].createdTime.seconds,
                talksData[key].createdTime.nanoseconds
              ),
            }
          );
        });

        Object.keys(participantsData).forEach(function (key) {
          db.collection('backupParticipants').doc(key).set(
            {
              userRef: db.collection('users').doc(participantsData[key].userRef),
              eventRef: db.collection('events').doc(participantsData[key].eventRef),
            }
          );
        });
      },
      restoreOnlyComments() {
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
            this.uploadOnlyComments(JSON.parse(reader.result));
          });
        });

        // 「ファイルを開く」ダイアログを表示する。
        input.click();
      },
      uploadOnlyComments(data) {
        let commentsData = data.commentsData;

        Object.keys(commentsData).forEach(function (talkKey) {
          Object.keys(commentsData[talkKey]).forEach(function (commentsKey) {
            Object.keys(commentsData[talkKey][commentsKey]).forEach(function (commentKey) {
              // db.collection('backupTalks').doc(talkKey).collection('comments').doc(commentKey).set({
              //   content: commentsData[talkKey][commentsKey][commentKey].content,
              //   userRef: commentsData[talkKey][commentsKey][commentKey].userRef,
              //   createdTime: new firebase.firestore.Timestamp(
              //     commentsData[talkKey][commentsKey][commentKey].createdTime.seconds,
              //     commentsData[talkKey][commentsKey][commentKey].createdTime.nanoseconds
              //   ),
              //   favoriteNum: commentsData[talkKey][commentsKey][commentKey].favoriteNum
              // });
              console.log(commentsData[talkKey][commentsKey][commentKey].content);
            });
          });
        });
      }
    },
  }
</script>

<style scoped>
</style>