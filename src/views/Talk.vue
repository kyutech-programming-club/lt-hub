<template>
  <div class="talk">
    <h1>Talk Page</h1>
    <div v-if="talk.id">
      <h2>{{ talk.data.title }}</h2>
      作成日時：{{ getStringFromDate(talk.data.createdTime.toDate()) }}<br>
      最終更新日時：{{ getStringFromDate(talk.data.updatedTime.toDate()) }}<br>
      動画URL: {{ talk.data.movieUrl }}<br>
      スライドURL: {{ talk.data.slideUrl }}<br>
      登壇者：{{ talk.talkUser.data.name }}<br>
    </div>
  </div>
</template>

<script>
  import { db } from '@/firebase/firestore.js'

  export default {
    name: 'Talk',
    data() {
      return {
        talk: {}
      }
    },

    created() {
      let self = this;
      console.log('Talk Page');
      let talkRef = db.collection('talks').doc(this.$route.params['id']);
      talkRef
        .get()
        .then(async(talk) => {
          let talkUser = await talk.data().userRef.get();
          if (talk.exists) {
            self.talk = {
              id: talk.id,
              data: talk.data(),
              talkUser: {
                id: talkUser.id,
                data: talkUser.data()
              }
            }
          }
        });
    },
    methods: {
      getStringFromDate(date) {
        var year_str = date.getFullYear();
        //月だけ+1すること
        var month_str = 1 + date.getMonth();
        var day_str = date.getDate();
        var hour_str = date.getHours();
        var minute_str = date.getMinutes();
        var second_str = date.getSeconds();

        month_str = ('0' + month_str).slice(-2);
        day_str = ('0' + day_str).slice(-2);
        hour_str = ('0' + hour_str).slice(-2);
        minute_str = ('0' + minute_str).slice(-2);
        second_str = ('0' + second_str).slice(-2);

        var format_str = 'YYYY-MM-DD hh:mm:ss';
        format_str = format_str.replace(/YYYY/g, year_str);
        format_str = format_str.replace(/MM/g, month_str);
        format_str = format_str.replace(/DD/g, day_str);
        format_str = format_str.replace(/hh/g, hour_str);
        format_str = format_str.replace(/mm/g, minute_str);
        format_str = format_str.replace(/ss/g, second_str);

        return format_str;
      }
    }


  }
</script>

<style scoped>
</style>
