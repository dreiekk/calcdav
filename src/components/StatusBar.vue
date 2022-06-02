<template>
    <div class="bg-dark text-white d-flex justify-content-between align-items-center text-left p-2" style="position: fixed; bottom: 0; left: 0; right: 0; width: 100%; height: 30px;">
      <a href="https://github.com/dreiekk/calcdav" target="_blank" class="text-muted" style="user-select: none; cursor: pointer; width: 140px;">
        <i class="fab fa-fw fa-github mr-1"></i>
        <span>dreiekk/calcdav</span>
      </a>
      <div class="text-muted text-center font-weight-light">
        <div v-if="!updateReady">
          <i v-if="updateLoading" class="fas fa-fw fa-spin fa-circle-notch mr-2"></i>
          <span>{{ updateStatus }}</span>
        </div>
        <a href="#" style="color: lightgray" @click="restartForUpdate" v-if="updateReady">
          <i class="fas fa-fw fa-box-open mr-2"></i>
          Update ready. Click here to install.
        </a>
      </div>
      <a href="#" class="text-right text-muted" style="user-select: none; cursor: default; pointer-events: none; width: 140px;">
        <span>v{{ appVersion }}</span>
      </a>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';
export default {
  name: 'StatusBar',
  data() {
    return {
      appVersion: null,
      updateStatus: null,
      updateLoading: null,
      updateReady: false
    }
  },
  methods: {
    restartForUpdate() {
      ipcRenderer.send('restartForUpdate');
    }
  },
  mounted() {
    ipcRenderer.send('requestVersion');
    ipcRenderer.on('version', (event, arg) => {
      this.appVersion = arg.version;
    });

    ipcRenderer.send('checkForUpdate');
    ipcRenderer.on('updateInfo', (event, arg) => {
      this.updateStatus = arg.updateStatus;
      this.updateLoading = arg.updateLoading;
      this.updateReady = arg.updateReady;
    });
  }
}
</script>

