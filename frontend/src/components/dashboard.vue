<template>
    <div>
    <div v-for="post in posts" v-bind:key="post.id">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
      <AttendingBar
              v-if="!loading && !error"
              :label="eventName"
              :chart-data="attending"
            ></AttendingBar>
    </div>
  </div>
</template>

<script>
import AttendingBar from './barChart.vue';
import axios from 'axios';
Vue.prototype.$http = axios;

export default {
  data() {
    return {
      eventName: [],
      attendings: [],
    };
  },

  methods: {
    async getData() {
      try {
        const response = await this.$http.get(
          "http://localhost:27017/eventData/last2months"
        );
        // JSON responses are automatically parsed.
        this.posts = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getData();
  },
};
</script>