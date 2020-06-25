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
      console.log(this.slideId);
    }
  }
</script>

<style scoped>
</style>

<!--<iframe-->
<!--  src="https://docs.google.com/presentation/d/e/2PACX-1vS5Ojx46NGgQ5du_EtFxk8_3naoD1hcoHPnPZBvQvQSCX1z3obAab91o4zlrDY_PJ0Wbp1MgfGmVcj6/embed?start=false&loop=false&delayms=3000" frameborder="0"-->
<!--  width="960"-->
<!--  height="569"-->
<!--  allowfullscreen="true"-->
<!--  mozallowfullscreen="true"-->
<!--  webkitallowfullscreen="true"></iframe>-->

<!--https://docs.google.com/presentation/d/e/2PACX-1vS5Ojx46NGgQ5du_EtFxk8_3naoD1hcoHPnPZBvQvQSCX1z3obAab91o4zlrDY_PJ0Wbp1MgfGmVcj6/pub?start=false&loop=false&delayms=3000-->