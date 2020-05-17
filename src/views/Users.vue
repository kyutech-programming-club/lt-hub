<template>
  <div class="users">
    <h1>This is Users page</h1>
    <div class="users-list">
      <user-item
        v-for="user in users"
        :key="user.uid"
        :user="user" />
    </div>
  </div>
</template>

<script>
  import UserItem from '@/components/UserItem.vue'
  import { db } from '@/firebase/firestore.js'

  export default {
    components: {
      UserItem
    },
    data() {
      return {
        users: []
      }
    },
    created() {
      let self = this;
      db.collection('users').get().then(function(users) {
        users.forEach(function(user) {
          console.log(user.data());
          self.users.push(user.data());
        });
      });
    }
  };
</script>
<style>
</style>
