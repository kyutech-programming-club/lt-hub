<template>
  <div class="user">
    <div v-if="user.name">
      <h1>{{ user.name }}</h1>
      <edit-user-form
        v-if="currentUserId == this.$route.params['uid']"
        :user="user"/>
      <img :src="user.photoURL"/><br>
      <div v-if="user.createdTime">
        作成日時：{{ getStringFromDate(user.createdTime.toDate()) }}<br>
      </div>
      <div v-if="user.updatedTime">
        最終更新日時：{{ getStringFromDate(user.updatedTime.toDate()) }}
      </div>

      <div v-if="userEvents" class="events-list">
        <user-event-item
          v-for="event in userEvents"
          :key="event.id"
          :event="event" />
      </div>
      <div v-if="userTalks" class="talks-list">
        <talk-item
          v-for="talk in userTalks"
          :key="talk.id"
          :talk="talk" />
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'
  import UserEventItem from '@/components/UserEventItem.vue'
  import TalkItem from '@/components/TalkItem.vue'
  import EditUserForm from '@/components/EditUserForm';

  export default {
    name: 'User',
    components: {
      UserEventItem,
      TalkItem,
      EditUserForm
    },
    data() {
      return {
        user: [],
        currentUserId: '',
        name: '',
        userEvents: [],
        userTalks: [],
        isValid: false
      }
    },
    created() {
      let self = this;
      firebase.auth().onAuthStateChanged(async(user) => {
        if (user != null) {
          this.$root.$set(self, 'currentUserId', user.uid);
        }
      });
    },
    watch: {
      name() {
        console.log('name: '+this.name);
      },
    },
    firestore() {
      return {
        user: db.collection('users').doc(this.$route.params['uid']),
        userEvents: db.collection('participants')
          .where('userRef', '==', db.collection('users').doc(this.$route.params['uid'])),
        userTalks: db.collection('talks')
          .where('userRef', '==', db.collection('users').doc(this.$route.params['uid']))
      }
    },
    methods: {
      update() {
        if (this.isValid) {
          db.collection('users')
            .doc(this.$route.params['uid'])
            .update({
              name: this.name,
              updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log(`User ${this.name} was updated.`);
              this.$router.go(this.$router.currentRoute);
            })
            .catch(err => {
              console.error(`Error occurred in update: ${err}`);
            });
        } else {
          console.log('Error occurred on validation.');
        }
      },
      requiredNotEmpty(value) {
        const spaceRemoved = value.replace(/\s/g, '');
        if (!spaceRemoved)
          return 'Name is required.';
        return true;
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
