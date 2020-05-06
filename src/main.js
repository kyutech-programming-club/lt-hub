import firebase from 'firebase'
import Vue from 'vue'
import App from './App.vue'
import {firebaseConfig} from './../firebase_config.js'

Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig)

new Vue({
  render: h => h(App),
}).$mount('#app')
