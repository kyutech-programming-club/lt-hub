<template>
  <div class="events">
    <h1>This is Events page</h1>
    <new-event-form />
  </div>
</template>

<script>
  import NewEventForm from './../components/NewEventForm.vue'

  export default {
    components: {
      NewEventForm,
    }
  };
</script>
<style>
</style>
