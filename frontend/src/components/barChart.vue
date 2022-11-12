<template>
    <canvas ref="myChart"></canvas>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables);
  export default {
    props: {
      label: {
        type: Array,
      },
      chartData: {
        type: Array,
      },
    },
    async mounted() {
      console.log(this.chartData);
      await new Chart(this.$refs.myChart, {
        type: "bar",
        data: {
          labels: this.label,
          datasets: [
            {
              label: "Clients",
              backgroundColor: "rgba(255,100,71 , 1 )",
              data: this.chartData,
            },
          ],
        },
        options: {
          scales: {
              y: {
                  min: 1
              }
          }
        }
      });
    },
  };
  </script>
