<template>
  <main class="flex flex-row">
    <div id="_container" class="h-screen">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
        </section>
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <li>
              <router-link to="/">
                <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                Dashboard
              </router-link> <!-- sets router link to dashboard-->
            </li>
            <li>
              <router-link to="/intakeform">
                <span style="position: relative; top: 6px" class="material-icons">people</span>
                Client Intake Form
              </router-link> <!-- sets router link to intake form-->
            </li>
            <li>
              <router-link to="/eventform">
                <span style="position: relative; top: 6px" class="material-icons">event</span>
                Create Event
              </router-link>
            </li> <!-- sets router link to eventform-->
            <li>
              <router-link to="/findclient">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Client
              </router-link> <!-- sets router link to findclient-->
            </li>
            <li>
              <router-link to="/findEvents">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Event
              </router-link> <!--sets router link to findevents-->
            </li>
          </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section
        class="justify-end items-center h-24 flex"
        style="
          background: linear-gradient(140deg, #C8102E 70%, #BEC4D4 50.6%);
          border-radius: 7px;
          border: 1px solid black"
      >
      <u class="text-black"><b><h1 class="mr-20 text-3xl text-black">{{ORG_NAME}}</h1></b></u> <!-- shows org name at top-->
      </section>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
export default {
  name: "App", //import acios
  data(){
    return {
      ORG_NAME: 'org' //returns org_name from .env file
    }
  },
  created() {
            let apiURL =  import.meta.env.VITE_ROOT_API + '/primarydata/organization';
            axios.get(apiURL).then(res => {
                this.ORG_NAME = res.data.organizationName; //gets organization name from organization route
            }).catch(error => {
                console.log(error)
            });}
};
</script>

<!-- background color and styles for menu bar-->
<style>
#_container {
  background-color: #c8102e; 
  color: white;
  padding: 5px;
  border: 1px solid black;
  border-radius: 15px;
}
</style>
