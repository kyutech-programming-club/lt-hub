<template>
  <div class="edit-item-form">
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
            @click="updateTalk">
            Update
          </v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'

  export default {
    props: {
      event: {
        type: Object
      }
    },
    data() {
      return {
        title: this.talk.data.title,
        slideUrl: this.talk.data.slideUrl,
        movieUrl: this.talk.data.movieUrl,
        isValid: false
      };
    },
    watch: {
      title() {
        console.log('title: ' + this.title);
      },
      slideUrl() {
        console.log('title: ' + this.slideUrl);
      },
      movieUrl() {
        console.log('title: ' + this.movieUrl);
      }
    },
    created() {
      console.log("I am edittalkform");
    },
    methods: {
      updateTalk() {
        console.log('update talk...');
        if (this.isValid) {
          db.collection('talks')
            .doc(this.talk.id)
            .update({
              title: this.title,
              slideUrl: this.talk.data.slideUrl,
              movieUrl: this.talk.data.movieUrl,
              updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log(`Talk ${this.title} was updated.`);
              this.$router.go(this.$router.currentRoute);
            })
            .catch(err => {
              console.error(`Error occurd in updateTalk: ${err}`);
            });
        } else {
          console.log("Error occurred on validation.");
        }
      },
      requiredNotEmpty(value) {
        //イベント名のみ入力必須項目
        const spaceRemoved = value.replace(/\s/g, '');
        if (!spaceRemoved)
          return "Required.";
        return true;
      }
    }
  }
</script>
<style scoped>
</style>