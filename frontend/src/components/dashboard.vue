<template>
  <div>
    <h2> Events scheduled from the past 2 months</h2>
    <AttendingBar
              v-if="!loading && !error"
              :label="labels"
              :chart-data="chartData"
            ></AttendingBar>

            <div class="mt-40" v-if="loading">
              <p
                class="
                  text-6xl
                  font-bold
                  text-center text-gray-500
                  animate-pulse
                "
              >
                Loading...
              </p>
            </div>
  </div>
</template>
  
  <script>
  import AttendingBar from './barChart.vue';
  import axios from "axios";
  export default {
    components:{
      AttendingBar, 
    },
    data(){
      return {
        labels: [],
        chartData :[],
        loading: false,
        error: null,
      }
    },
methods: {
    async fetchData() {
      try {
        this.error = null;
        this.loading = true;
        const url = import.meta.env.VITE_ROOT_API + '/eventData/last2months';
        const response = await axios.get(url);
        //"re-organizing" - mapping json from the response
        this.labels = response.data.map((item) => item.eventName);
        this.chartData = response.data.map((item) => item.number_of_clients);
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: "Server Response",
            message: err.message,
          };
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: "Unable to Reach Server",
            message: err.message,
          };
        } else {
          // There's probably an error in your code
          this.error = {
            title: "Application Error",
            message: err.message,
          };
        }
      }
      this.loading = false;
    },
  },
  mounted() {
    this.fetchData();
  },
};
  </script>