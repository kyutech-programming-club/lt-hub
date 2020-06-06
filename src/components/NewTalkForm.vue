<template>
  <div class="new-talk-form">
    <v-card class="pa-4 ma-6">
      <v-form v-model="isValid" @submit.prevent>
        <v-card-text>
          <v-text-field
            v-model="title"
            label="タイトル"
            :rules="[requiredNotEmpty]" />
          <v-text-field
            v-model="slideUrl"
            label="スライドURL" />
          <v-text-field
            v-model="movieUrl"
            label="動画URL" />
          <v-btn
            color="blue"
            :x-large="true"
            @click="createTalk">
            トーク作成
          </v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        title: '',
        slideUrl: '',
        movieUrl: '',
        isValid: false
      };
    },
    watch: {
      title() {
        console.log('title: '+this.title);
      },
      slideUrl() {
        console.log('slide: '+this.slideUrl);
      },
      movieUrl() {
        console.log('movie: '+this.movieUrl);
      },
    },
    methods: {
      requiredNotEmpty(value) {
        //イベント名のみ入力必須項目
        const spaceRemoved = value.replace(/\s/g, '');
        if (!spaceRemoved)
          return "Required.";
        return true;
      }
    }
  };
  </script>
  <style scoped>
  </style>
