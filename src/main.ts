import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import vuefire from '@/plugins/vuefire'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  vuefire,
  render: h => h(App),
}).$mount('#app')
