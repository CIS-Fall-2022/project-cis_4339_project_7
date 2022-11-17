<template> <!-- start vuejs code-->
  <main>
    <div style="
          border-radius: 7px;
          border: 2.5px solid black">
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Create New Event</h1>
    </div>
    <div class="px-10 py-20" style="
          background: linear-gradient(140deg, #ffffff
 70%, #BEC4D4 50.6%);
          border-radius: 7px;
          border: 2.5px solid black">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm"> <!-- button for submitting to handle submit form-->
        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Event Details</h2> 

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Event Name</span> <!--makes input for event name-->
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.eventName"
              /> <!-- references eventname in v-model-->
              <span class="text-black" v-if="v$.event.eventName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.event.eventName.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- if error, show error message-->
              </span>
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Date</span> <!-- makes input for date-->
              <span style="color:#ff0000">*</span>
              <input
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.date"
                type="date"
              /> <!-- makes a new date input type instead of regular input box-->
              <span class="text-black" v-if="v$.event.date.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.event.date.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- if error, show error as message-->
              </span>
            </label>
          </div>

          <div></div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Description</span> <!-- input for description-->
              <textarea
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="2" v-model="event.description"
              ></textarea> <!-- references description in v-model-->
            </label>
          </div>

          <div></div>
          <div></div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col grid-cols-3">
            <label>Services Offered at Event</label>
            <div>
              <label for="familySupport" class="inline-flex items-center"> <!-- references check box for familysupport service-->
                <input
                  type="checkbox"
                  id="familySupport"
                  value="Family Support"
                  v-model="checkedServices"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  notchecked
                /> <!-- references checked services-->
                <span class="ml-2">Family Support</span>
              </label>
            </div>
            <div>
              <label for="adultEducation" class="inline-flex items-center"> <!--makes input checked box-->
                <input
                  type="checkbox"
                  id="adultEducation"
                  value="Adult Education"
                  v-model="checkedServices"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  notchecked
                /> <!-- references checked services in v-model-->
                <span class="ml-2">Adult Education</span> <!-- makes input for checked adult education service-->
              </label>
            </div>
            <div>
              <label for="youthServices" class="inline-flex items-center">
                <input
                  type="checkbox"
                  id="youthServices"
                  value="Youth Services Program"
                  v-model="checkedServices"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  notchecked
                /> <!-- references checkedservices in v-model-->
                <span class="ml-2">Youth Services Program</span>
              </label>
            </div>
            <div>
              <label for="childhoodEducation" class="inline-flex items-center"> <!-- makes input for services -->
                <input
                  type="checkbox"
                  id="childhoodEducation"
                  value="Early Childhood Education"
                  v-model="checkedServices"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  notchecked
                /> <!-- checkbox for services.-->
                <span class="ml-2">Early Childhood Education</span>
              </label>
            </div>
          </div>
        </div>

        <!-- grid container -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Address</h2> <!-- makes div element to show address in h2-->
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 1</span> <!-- makes input for address line 1-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.line1"
              /> <!-- references address line 1 on v-model-->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span> <!-- makes form for address line 2-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.line2"
              /> <!-- references address line 2-->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block"> 
              <span class="text-gray-700">City</span> <!-- makes form for city-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.city"
              /> <!-- references city -->
            </label>
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span> <!-- makes form for county-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.county"
              /> <!-- references county in v-model-->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col"> <!-- makes form for zip code-->
            <label class="block">
              <span class="text-gray-700">Zip Code</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.zip"
              /> <!-- references zip code in v-model-->
            </label>
          </div>
        </div>

        <div class="flex justify-between mt-10 mr-20">
          <button class="bg-red-700 text-white rounded" type="submit">Add New Event</button>
        </div> <!-- makes button for adding event-->
      </form>
    </div>
  </main>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import axios from "axios"; //imports whatever is required.
export default {
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) }; //sets up vuevalidate
  },
  data() {
    return {
      checkedServices: [],
      event: {
        eventName: "",
        services: [], //returns all these variables
        date: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          county: "",
          zip: "", //zip, address, description ,etc
        },
        description: "", 
      },//closes everything out
    };
  },
  methods: {
    async handleSubmitForm() { 
      // Checks to see if there are any errors in validation
      const isFormCorrect = await this.v$.$validate();
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect) {
        this.event.services = this.checkedServices;
        let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/event`; //imports all from /event
        axios
          .post(apiURL, this.event)
          .then(() => {
            alert("Event has been added."); //alerts if actually added
            this.$router.back().catch((error) => { //catches error from backend
            console.log(error); //pushes to frontend
            this.$router.push("/findEvents"); //pushes to /findevents.vue
            this.client = {
              eventName: "", //adds event models
              services: [],
              date: "",
              address: {
                line1: "",
                line2: "",
                city: "",
                county: "",
                zip: "",
              },
              description: "",
            };
            this.checkedServices = [];
          })
          .catch((error) => {
            console.log(error); //catches error from the console log in the backend
          });
        })}
  }},
  // sets validations for the various data properties
  validations() {
    return {
      event: {
        eventName: { required }, //event name is required
        date: { required }, //date is required
      },
    };
  },
};


//closes out vuejs form
</script> 

