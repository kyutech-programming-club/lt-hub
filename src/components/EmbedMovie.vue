<template>
  <div class="iframe-wrap">
    <iframe
      :src="embedMovieUrl">
    </iframe>
  </div>
</template>

<script>
  export default {
    name: 'EmbedMovie',
    props: {
      movieUrl: String
    },
    computed: {
      embedMovieUrl: function() {
        return 'https://www.youtube.com/embed/' + this.movieUrl;
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
