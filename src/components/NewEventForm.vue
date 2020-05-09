<template>
  <div class="new-item-form">
    <v-card class="pa-4 ma-6">
      <v-card-title>
        <v-toolbar>
          <v-toolbar-title class=mx-auto>
            イベント新規作成
          </v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="title"
          label="イベント名" />
        <v-text-field
          v-model="description"
          label="イベント概要" />
        <v-text-field
          v-model="author"
          label="作成者" />
        <v-date-picker
          v-model="startDate"
          label="開始日"/>
        <v-time-picker
          v-model="startTime"
          label="開始時刻"/>
        <v-text-field
          v-model="place"
          label="会場" />
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      title: "",
      description: "",
      author: "",
      startDate: "",
      startTime: "",
      place: "",
    };
  },
  watch: {
    title: function() {
      console.log("title: "+this.title);
    },
    description: function() {
      console.log("description: "+this.description);
    },
    author: function() {
      console.log("author: "+this.author)
    },
    startDate: function() {
      console.log("startDate: "+this.startDate);
    },
    startTime: function() {
      console.log("startTime: "+this.startTime);
    },
    place: function() {
      console.log("place: "+this.place);
    },
  },
};
</script>
<style scoped>
</style>
