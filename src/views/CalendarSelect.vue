<template>
  <div>

      <div class="alert alert-success">
        Successfully connected to caldav-server
      </div>
      
      <div class="container d-flex flex-column">
        <h4 class="text-white mt-5 mb-3">Choose a calendar</h4>
        <div class="list-group">
          <a href="#" @click="selectCalendar(calendar)" class="list-group-item list-group-item-action" v-for="(calendar, index) in calendars" :key="index">{{ calendar.displayName }}</a>
        </div>
    </div>
  </div>
</template>

<style scoped>
  .list-group-item {
    color: white;
    background-color: #333;
  }
  .list-group-item:hover,
  .list-group-item:active,
  .list-group-item:focus {
    color: white;
    background-color: #444;
  }
</style>

<script>
export default {
  name: 'CalendarSelect',
  data: function() {
    return {
      calendars: []
    }
  },
  methods: {
    selectCalendar(calendar) {
      console.log(calendar);
      this.$store.commit('selectCalendar', calendar);
      this.$router.push({ path: '/dashboard' });
    }
  },
  mounted() {
    this.$store.state.davAccount.calendars.forEach((calendar) => {
      console.log('Found calendar named ' + calendar.displayName);
      this.calendars.push(calendar);
    });
  }
}
</script>
