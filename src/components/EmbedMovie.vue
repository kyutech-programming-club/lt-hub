<template>
  <div>
    <iframe
      :src="embedMovieUrl">
    </iframe>
  </div>
</template>

<script>
  export default {
    name: "EmbedMovie",
    props: {
      movieUrl: String
    },
    computed: {
      embedMovieUrl: function() {
        return this.movieUrl
      }
    },
    data() {
      return {
        embedUrl: ''
      }
    },
    created() {
      console.log(this.movieUrl);
    }
  }
</script>

<style scoped>
</style>