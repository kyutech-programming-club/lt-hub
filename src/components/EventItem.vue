<template>
  <div class="event-item">
    <div v-if="event.id">
      <v-card class="pa-4 ma-6" color="#CBFFD3" @click="goEventPage">
        <v-card-title>{{event.title}}</v-card-title>
        <div v-if="event.start">
          期間：{{ getStringFromDate(this.event.start.toDate()) }} ~ {{ getStringFromDate(this.event.end.toDate()) }}<br>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      event: {
        type: Object
      }
    },
    methods: {
      goEventPage() {
        this.$router.push({ name : 'event', params: { id: this.event.id, event: this.event}});
      },
      //日付から文字列に変換する関数
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

        var format_str = 'YYYY/MM/DD hh:mm:ss';
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
