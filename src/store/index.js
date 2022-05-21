import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    davInstance: null,
    davAccount: null,
    davXhr: null,
    isLoggedIn: false,
    loading: false,
    auth_error: null,
    calendars: [],
    calendar: null
  },
  getters: {
    // 
  },
  mutations: {
    login(state) {
      state.loading = true;
      state.auth_error = null;
    },
    loginSuccess(state, payload) {
      state.auth_error = null;
      state.isLoggedIn = true;
      state.loading = false;
      state.davInstance = payload.dav;
      state.davAccount = payload.account;
      state.davXhr = payload.xhr;
    },
    loginFailed(state, payload) {
      state.loading = false;
      state.auth_error = payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.davInstance = null;
      state.davAccount = null;
      state.davXhr = null;
    },
    selectCalendar(state, payload) {
      state.calendar = payload;
    }
  },
  actions: {
    login(context) {
      context.commit('login');
    }
  },
  modules: {
    // 
  }
})
