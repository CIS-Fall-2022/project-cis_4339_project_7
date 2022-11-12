<template>
    <div>
        <br>
        <br>
        <div>
            
            <hr/>
            <br>
            <h2>Cases</h2>
            <br>
            <br>
            <AttendingBar
            :label="labels"
            :chart-data="attending" 
            ></AttendingBar>
            <br>
            <br>
        </div>
    </div>
    </template>
    
    <script>
    import axios from "axios";
    import AttendingBar from './barChart.vue';
    export default {
         data : ()=> {
            return {
                labels : [],
                attending : [],
            }
    
        },
        components : {
            AttendingBar,
        },
        async created() {
      const { data } = await axios.get("http://localhost:27017/eventData/last2months");
      var c=0
      for(var i=0;i<1000;i++){
                  this.labels.push(data[i].eventName)
                  this.confirmed.push(data[i].attending)
                  c=c+1
                  if(c==28){
                    break
                  }
                }
      }
    }   
    
    </script>