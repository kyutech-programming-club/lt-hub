import Vue from "vue";
import Vuex from "vuex";
// import User from "@/types/user.ts";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment: (state) => state.count++,
  },
});
