<template>
  <div class="iframe-wrap">
    <iframe
      :src="embedSlideUrl"
      allowfullscreen="true"
      mozallowfullscreen="true"
      webkitallowfullscreen="true">
    </iframe>
  </div>
</template>

<script>
  export default {
    name: 'EmbedMovie',
    props: {
      slideUrl: String
    },
    computed: {
      embedSlideUrl: function() {
        return 'https://docs.google.com/presentation/d/e/' + this.slideUrl + '/embed?start=false&loop=false&delayms=3000';
      }
    },
    created() {
      console.log(this.slideUrl);
    }
  }
</script>

<style scoped>
</style>
