<template>
  <div id="app">
    <h1>Welcome to LT-Hub!</h1>
    <p>{{ count }}</p>
    <p>
      <button @click="increment">+</button>
    </p>
    <v-img alt="Vue logo" src="@/assets/logo.png" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component
export default class Home extends Vue {
  get count(): number {
    return this.$store.state.count;
  }
  increment(): void {
    this.$store.commit("increment");
  }
}
</script>
<style scoped></style>
