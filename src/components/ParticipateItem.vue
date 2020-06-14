<template>
  <div class="user-item mx-10" style="display: inline-block">
    <v-list>
      <v-list-item @click="goUserPage">
        <v-list-item-avatar class="d-inline-block" size="50">
          <v-img
            :src="user.userRef.photoURL"
          />
        </v-list-item-avatar>
        <v-list-item-content>{{user.userRef.name}}</v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
  export default {
    props: {
      user: {
        type: Object
      }
    },
    methods: {
      goUserPage() {
        this.$router.push({ name : 'user', params: { uid: this.user.userRef.id}});
      }
    }
  }
</script>

<style scoped>
</style>
