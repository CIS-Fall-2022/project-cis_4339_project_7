<script>
import useVuelidate from "@vuelidate/core";
import { required, email, alpha, numeric } from "@vuelidate/validators"; //validation
import VueMultiselect from "vue-multiselect"; //imports multiselect
import axios from "axios"; //imports axios
import { DateTime } from "luxon"; //imports datetime

export default {
  props: ["id"],
  components: { VueMultiselect },
  setup() { //sets up multiselect
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  data() {
    return {
      //for multi select
      eventsChosen: [], //puts eventschosen in empty array
      //for multi select event Data
      eventData: [], //puts eventsdata in empty array
      // Client Data
      client: {
        firstName: "",
        middleName: "",
        lastName: "", //client model
        email: "",
        phoneNumbers: [
          {
            primaryPhone: "",
            secondaryPhone: "", //phonenumbers
          },
        ],
        address: {
          line1: "",
          line2: "", //addresses
          city: "",
          county: "",
          zip: "",
        },
      },
      // list of events shown in table
      clientEvents: [], //clientevents in chosen array
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  beforeMount() {
    axios
      .get(
        import.meta.env.VITE_ROOT_API +
          `/primarydata/id/${this.$route.params.id}` //gets all clients from backend route
      )
      .then((resp) => {
        let data = resp.data;
        this.client.firstName = data.firstName;
        this.client.middleName = data.middleName;
        this.client.lastName = data.lastName;
        this.client.email = data.email;
        this.client.phoneNumbers[0].primaryPhone =
          data.phoneNumbers[0].primaryPhone; //sets all variables from model equal to variable relating to data
        this.client.phoneNumbers[0].secondaryPhone =
          data.phoneNumbers[0].secondaryPhone;
        this.client.address.line1 = data.address.line1;
        this.client.address.line2 = data.address.line2;
        this.client.address.city = data.address.city;
        this.client.address.county = data.address.county;
        this.client.address.zip = data.address.zip;
      });
    axios
      .get(
        import.meta.env.VITE_ROOT_API +
          `/primarydata/events/${this.$route.params.id}` //gets events attached to client based on id parameters
      )
      .then((resp) => {
        let data = resp.data;
        data.forEach((event) => {
          this.clientEvents.push({
            eventName: event.eventName, //pushes only event name and eventdate
            eventDate: event.date,
          });
        });
      });
    axios.get(import.meta.env.VITE_ROOT_API + `/eventdata`).then((resp) => {
      let data = resp.data; //gets all from eventdata and then makes data as response data
      for (let i = 0; i < data.length; i++) {
        this.eventData.push({
          eventName: data[i].eventName,
          _id: data[i]._id, //pushes eventname, _id, and attendees array
          attendees: data[i].attendees,
        });
      }
    });
  },
  methods: {
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    }, //formats date as needed from isodatetime
    async handleClientUpdate() {
      const isFormCorrect = await this.v$.$validate();
      if (isFormCorrect) { //if the client enters all correct inputs
      let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/updateclient/${this.id}`;
      axios.put(apiURL, this.client).then((resp) => { //update the client based on the backend route to update
        alert(JSON.stringify(resp.data)); //json the error alert
        this.$router.back().catch((error) => {
          console.log(error); //if there is an error, grab the error from the backend and push to the front end via alert
        });
      });
    }},
    deleteClient(){
      this.eventData.forEach((event) => {
        let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/removeattendees/` + event._id;
        axios.put(apiURL, { attendee: this.id}); //if you want to delete a client
      }); //it grabs from the backend route for removing attendees
      let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/primarydatadel/${this.id}`;
      axios.delete(apiURL, this.client).then((resp) => { //delete from primary data
        alert(JSON.stringify(resp.data));
        this.$router.back().catch((error) => {//if error, gets error from backend
          console.log(error); //and pushes it to frontend via alert
        });
      });
    },
    addToEvent() {
      this.eventsChosen.forEach((event) => { //if adding attendee to event
        let apiURL =
          import.meta.env.VITE_ROOT_API + `/eventdata/addAttendee/` + event._id;
        axios.put(apiURL, { attendee: this.$route.params.id }).then((resp) => { //puts attendee into eventdata via backend route
          alert(JSON.stringify(resp.data)); //jsonify the error
          this.$router.back().catch((error) => {
            console.log(error); //if there is error, grab from the backend and show in the frontend via alert
            });
          })
      });      
    },
  },  
  validations() {
    return {
      client: {
        firstName: { required, alpha },
        lastName: { required, alpha }, //sets up validations for variables in client input
        email: { email },
        phoneNumbers: [
          {
            primaryPhone: { required, numeric },
          },
        ],
      },
    };
  },
};
</script>

<template>
  <main>
    <div style="
          border-radius: 7px;
          border: 2px solid black">
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Update Client</h1></div>
    <div class="px-10 py-20" style="
          background: linear-gradient(140deg, #ffffff
 70%, #BEC4D4 50.6%);
          border-radius: 7px;
          border: 2.5px solid black">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm"> <!-- references submit button-->
        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Personal Details</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">First Name</span>
              <span style="color:#ff0000">*</span><!-- input for firstname-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="client.firstName"
              /> <!-- references firstname in v-model-->
              <span class="text-black" v-if="v$.client.firstName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.firstName.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- if error , show error message in front end-->
              </span>
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Middle Name</span><!-- input for middle name-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="client.middleName"
              /> <!-- references middle name in v-model-->
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Last Name</span> <!--input for last name-->
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="client.lastName"
              /> <!-- references last name in v-model -->
              <span class="text-black" v-if="v$.client.lastName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.lastName.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- if error inputting, then show error message in front end-->
              </span>
            </label>
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Email</span><!-- input for email-->
              <input
                type="email"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                v-model="client.email"
              /> <!-- references email in v-model-->
              <span class="text-black" v-if="v$.client.email.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.email.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- if error in inputting, show error message-->
              </span>
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Phone Number</span>
              <span style="color:#ff0000">*</span> <!-- input box for phone number-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                v-model="client.phoneNumbers[0].primaryPhone"
              /><!-- references phone number in v-model -->
              <span class="text-black" v-if="v$.client.phoneNumbers[0].primaryPhone.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.phoneNumbers[0].primaryPhone.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- if error in input, show error message-->
              </span>
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Alternative Phone Number</span> <!-- input for alt phone number-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                v-model="client.phoneNumbers[0].secondaryPhone"
              /> <!-- references phone numbers in v-model-->
            </label>
          </div>
        </div>

        <!-- grid container -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Address Details</h2> 
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 1</span> <!-- input for address line 1-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line1"
              /> <!-- references line 1 in v-model-->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span> <!-- input for address line 2-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line2"
              /> <!-- references line 2 in v-model-->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span>
              <span style="color:#ff0000">*</span> <!-- input for city-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.city"
              /> <!-- references city in v-model-->
            </label>
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block"> 
              <span class="text-gray-700">County</span> <!-- input for county-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.county"
              /> <!-- references county in v-model-->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span> <!-- input for zip code-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.zip"
              /> <!-- references zip in v-model-->
            </label>
          </div>
          <div></div>
        </div>

        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div class="flex justify-between mt-10 mr-20">
            <button
              @click="handleClientUpdate"
              type="submit"
              class="bg-red-700 text-white rounded"
            >Update Client</button>
          </div> <!-- button for updating client-->
          <div class="flex justify-between mt-10 mr-20">
            <!--delete button connected to delete method-->
            <button
              @click="deleteClient"
              type="submit"
              class="bg-red-700 text-white rounded"
            >Delete Client</button> <!-- button for deleting client-->
          </div>
          <div class="flex justify-between mt-10 mr-20">
            <button
              type="reset"
              class="border border-red-700 bg-white text-red-700 rounded"
              @click="$router.go(-1)"
            >Go back</button> <!-- goes back to previous page-->
            </div>
            
          </div>

        <hr class="mt-10 mb-10" />

        <!-- Client Event Information -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10" >
          <h2 class="text-2xl font-bold">Events for Client</h2> <!-- sets up list for events for client-->

          <div class="flex flex-col col-span-2">
            <table class="min-w-full shadow-md rounded" style="
          border: .5px solid black">
              <thead class="bg-gray-50 text-xl">
                <tr>
                  <th style="
          border: .5px solid black" class="p-4 text-left">Event Name</th>
                  <th style="
          border: .5px solid black" class="p-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-300">
                <tr v-for="event in clientEvents" :key="event._id">
                  <td class="p-2 text-left">{{ event.eventName }}</td>
                  <td class="p-2 text-left">{{ formattedDate(event.eventDate) }}</td>
                </tr> <!-- puts eventname and eventdate on screen-->
              </tbody>
            </table>
          </div>

          <div class="flex flex-col">
            <label class="typo__label">Select Events to be added</label> <!-- sets up multiselect-->
            <VueMultiselect
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="eventsChosen"
              :options="eventData"
              :multiple="true"
              :searchable="false"
              :allowempty="true"
              :close-on-select="false"
              track-by="eventName"
              label="eventName"
              style="
              border: .5px solid black"
            ></VueMultiselect> <!-- all the aspects of multiselect, can be toggled true, or false.-->
            <div class="flex justify-between">
              <button
                @click="addToEvent"
                type="submit"
                class="mt-5 bg-red-700 text-white rounded"
              >Add Client to Events</button> <!-- add to event button -->
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
</template> <!-- closes out code-->
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
