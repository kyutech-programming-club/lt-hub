<template>
  <div class="new-item-form">
    <p>{{new_event_title}}</p>
    <input v-model="new_event_title" />
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      new_event_title: "",
    };
  },
};
</script>
<style scoped>
</style>
