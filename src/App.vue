<template>
  <div id="app">
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
import StatusBar from '@/components/StatusBar.vue'

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