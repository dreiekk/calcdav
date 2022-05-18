<template>
  <div id="app">
    <!-- <div id="nav"> -->
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    <!-- </div> -->
    <div style="width: 100%; height: 30px;">
      <!--  -->
    </div>
    <router-view/>
    <StatusBar></StatusBar>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
// @ is an alias to /src
import StatusBar from '@/components/StatusBar.vue'

// const { ipcRenderer } = require('electron')

export default {
  name: 'App',
  components: {
    StatusBar
  },
  created() {
    this.$i18n.locale = navigator.language;
  }
}
</script>