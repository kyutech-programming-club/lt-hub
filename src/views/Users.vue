<template>
  <div class="users">
    <h1>This is Users page</h1>
    <v-row justify="center" align-content="center" class="pt-12">
      <div class="users-list">
        <user-item
          v-for="user in users"
          :key="user.id"
          :user="user" />
      </div>
    </v-row>
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
      db.collection('users').get().then(users => {
        users.forEach(user => {
          console.log(user.id);
          console.log(user.data());
          self.users.push({
            id: user.id,
            data: user.data()
          });
        });
      });
    }
  };
</script>
<style scoped>
</style>
