<template>
    <canvas ref="myChart"></canvas> <!-- refernces chart-->
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables); //imports from chartsjs
  export default {
    props: {
      label: {
        type: Array, //type array for labels
      },
      chartData: {
        type: Array, //type array for chartData
      },
    },
    async mounted() { //mounts instance
      console.log(this.chartData);
      await new Chart(this.$refs.myChart, { //type bar chart
        type: "bar",
        data: {
          labels: this.label, //sets up labels
          datasets: [
            {
              label: "Clients", //client is label name
              backgroundColor: "rgb(236, 121, 44)", //background color
              data: this.chartData, //takes data from chartData variable
            },
          ],
        },
        options: {
          scales: { //scales
              y: {
                  min: 0
              }
          }
        }
      });
    },
  }; //ends script
  </script>
