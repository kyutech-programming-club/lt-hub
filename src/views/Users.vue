<template>
  <div class="users">
    <h1>Users</h1>
    <v-row justify="center" align-content="center" class="pt-12">
      <div class="users-list" v-if="users">
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
  import { db } from '@/firebase/firestore.ts'

  export default {
    components: {
      UserItem
    },
    data() {
      return {
        users: []
      }
    },
    firestore() {
      return {
        users: db.collection('users')
      }
    }
  };
</script>
<style scoped>
</style>
