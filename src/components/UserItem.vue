<template>
  <div class="user-item">
    <v-card class="d-inline-block mx-auto" @click="goUserPage">
      <v-container>
        <v-img
          height="200px"
          width="200px"
          :src="user.photoURL"
        />
        <v-card-title>{{user.name}}</v-card-title>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: ['user'],
    methods: {
      goUserPage() {
        console.log("goUserPage");
        this.$router.push({ name : "user", params: { uid: this.user.uid}});
      }
    }
  }
</script>

<style>
</style>
