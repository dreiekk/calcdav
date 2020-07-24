<template>
  <div class="w-100 h-100">
    <div v-if="error" class="alert alert-danger text-center">
      Error connecting / authenticating to caldav-server<br />
    </div>

    <div class="login-form-container">
      <div class="login-form p-4">
        <h3 class="text-center">CalcDAV</h3>

        <form @submit.prevent="login">
          <div class="form-group">
            <label for="inputCaldavUrl">CalDAV-URL</label>
            <input type="text" class="form-control" id="inputCaldavUrl" v-model="inputCaldavUrl" placeholder="CalDAV-URL">
          </div>
          <div class="form-group">
            <label for="inputUsername">Username</label>
            <input type="text" class="form-control" id="inputUsername" v-model="inputUsername" placeholder="Username">
          </div>
          <div class="form-group">
            <label for="inputPassword">Password</label>
            <input type="password" class="form-control" id="inputPassword" v-model="inputPassword" placeholder="Password">
          </div>
          <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">
            <i v-if="!loading" class="fas fa-fw fa-key"></i>
            <i v-if="loading" class="fas fa-fw fa-spin fa-circle-notch"></i>
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .login-form-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: -70px;
  }

  .login-form {
    background-color: #333;
    color: white;
    box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, .2);
    text-align: left;
  }
</style>

<script>
import { initDav } from '../helpers/DavFunctions';

export default {
  name: 'Login',
  data: function() {
    return {
      inputCaldavUrl: "",
      inputUsername: "",
      inputPassword: "",
      // error: null
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    error() {
      return this.$store.state.auth_error;
    }
  },
  methods: {
    login() {

      if (this.$store.loading) {
        console.log('still in loading state - prevented form submit');
        return;
      }

      console.log('logging in...');

      localStorage.setItem('loginPrefillCaldavUrl', this.inputCaldavUrl);
      localStorage.setItem('loginPrefillUsername', this.inputUsername);

      this.$store.dispatch('login');

      initDav(this.inputCaldavUrl, this.inputUsername, this.inputPassword)
        .then((res) => {
          this.$store.commit('loginSuccess', res);
          this.$router.push({ path: '/calendar-select' });
        })
        .catch((error) => {
          this.$store.commit('loginFailed', { error });
          // alert(error);
        });
      
    },
  },
  mounted() {
  
    this.inputCaldavUrl = localStorage.getItem('loginPrefillCaldavUrl');
    this.inputUsername = localStorage.getItem('loginPrefillUsername');

    if (this.inputCaldavUrl == null) document.getElementById('inputCaldavUrl').focus();
    else if (this.inputUsername == null) document.getElementById('inputUsername').focus();
    else document.getElementById('inputPassword').focus();

  }
}
</script>
