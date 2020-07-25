import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* eslint-disable no-unused-vars */
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './style.css';
import './custom-bootstrap.css';

import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import i18n from './i18n'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const davInstance = store.state.davInstance;

  if (requiresAuth && !davInstance) {
    next('/login');
  } else if (to.path == '/login' && davInstance) {
    next('/');
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
