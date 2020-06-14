<template>
  <div class="user-item mx-10" style="display: inline-block">
    <v-avatar class="d-inline-block" size="128" @click="goUserPage">
      <v-img
        :src="user.photoURL"
      />
    </v-avatar>
    <v-card-title>{{user.name}}</v-card-title>
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
        this.$router.push({ name : 'user', params: { uid: this.user.id}});
      }
    }
  }
</script>

<style scoped>
</style>
