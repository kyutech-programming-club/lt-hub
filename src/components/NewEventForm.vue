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
          v-model="newEventTitle"
          label="イベント名" />
        <v-text-field
          label="イベント概要" />
        <v-text-field
          label="作成者" />
        <v-date-picker
          label="開始日"/>
        <v-time-picker
          label="開始時刻"/>
        <v-text-field
          label="会場" />
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      newEventTitle: "",
    };
  },
};
</script>
<style scoped>
</style>
