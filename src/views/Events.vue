<template>
  <div class="events">
    <h1>This is Events page</h1>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-card-title>
            <v-toolbar :flat="true">
              <v-toolbar-title class="mx-autoi">
                イベント新規作成
              </v-toolbar-title>
            </v-toolbar>
          </v-card-title>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <new-event-form />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
  import NewEventForm from '@/components/NewEventForm.vue'

  export default {
    components: {
      NewEventForm,
    }
  };
</script>
<style>
</style>
