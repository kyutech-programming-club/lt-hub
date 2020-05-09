import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import {firebaseConfig} from './../firebase_config.js'

Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
