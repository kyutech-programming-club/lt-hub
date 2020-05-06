import firebase from 'firebase'
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "",
  authDomain: "lt-hub.firebaseapp.com",
  databaseURL: "https://lt-hub.firebaseio.com",
  projectId: "lt-hub",
  storageBucket: "lt-hub.appspot.com",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
}
firebase.initializeApp(firebaseConfig)

new Vue({
  render: h => h(App),
}).$mount('#app')
