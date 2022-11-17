<template>
  <div style="position: absolute;
  top: 50%;
  left: 33%;   width: 650px;
  height: 370px;"> <!-- sets position for chart-->

  <div></div>
    <div><h4><b> Events scheduled for the past 2 months: </b></h4></div> <!--labels chart-->
    <AttendingBar
              v-if="!loading && !error"
              :label="labels"
              :chart-data="chartData"
            ></AttendingBar> <!-- gets elements from barchart into frontend visualization-->

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
              </p> <!-- before the chart is loaded.-->
            </div>
            </div>

    <div class="row justify-content-center" style="position: absolute;
  top: 18%;
  left: 42%;">
    <table class="table table-striped" style="
          border: .5px solid black">
      <thead class="table-dark">
        <tr>
          <th style="
          border: .5px solid black">Event Name</th> <!-- dashboard names for event name and number of clients-->
          <th >Number of Clients Registered</th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="data in allData" :key="data.id">
          <td style="
          border: .5px solid black">{{ data.eventName }}</td>
        <p></p>
          <td >{{ data.number_of_clients }}</td> <!-- returns the number of clients
          and event name below the chart-->
        </tr>
      </tbody>
    </table>
  </div>

</template>
  
<script> //starts script
  import AttendingBar from './barChart.vue';
  import axios from "axios"; //importing dependencies for map
  export default {
    components:{
      AttendingBar, 
    },
    data(){
      return {
        allData:[], //returns map elements
        labels: [],
        chartData :[], //returns chart data and labels from barchart.vue
        loading: false,
        error: null,
      }
    },

methods: {
    async fetchData() {
      try {
        this.error = null; // if the error is null and loading of map is right
        this.loading = true;
        const url = import.meta.env.VITE_ROOT_API + '/eventData/last2months';
        const response = await axios.get(url); //import from eventdata/last2months route in backend
        //"re-organizing" - mapping json from the response
        this.allData = response.data; //puts into allData variable
        this.labels = response.data.map((item) => item.eventName); //puts eventName from backend into labels
        this.chartData = response.data.map((item) => item.number_of_clients); //puts number_of_clients from backend into label
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: "Server Response",
            message: err.message, //success message
          };
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: "Unable to Reach Server",
            message: err.message, // if server error
          };
        } else {
          // There's probably an error in your code
          this.error = {
            title: "Application Error",
            message: err.message, //error in application
          };
        }
      }
      this.loading = false;
    },
  },
  mounted() {
    this.fetchData(); //mount the source
  },
};
  </script>

  
