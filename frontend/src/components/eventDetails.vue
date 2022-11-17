<template>
  <main>
    <div style="
          border-radius: 7px;
          border: 2px solid black"> <!-- sets up div for update event-->
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Update Event</h1>
    </div>
    <div class="px-10 py-20" style="
          background: linear-gradient(140deg, #ffffff
 70%, #BEC4D4 50.6%);
          border-radius: 7px;
          border: 2.5px solid black">
      <form @submit.prevent="handleSubmitForm"> <!--sets up button for submit form-->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Event Details</h2> <!--div for event details-->
          <!-- form field -->
          <div class="flex flex-col"> <!-- sets up div for event name-->
            <label class="block">
              <span class="text-gray-700">Event Name</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.eventName"
              /> <!-- gets reference from eventName in event v-model created below-->
              <span class="text-black" v-if="v$.event.eventName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.event.eventName.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- in case of error, it will give you an error message-->
              </span>
            </label>
          </div> <!-- closes div -->

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Date</span> <!-- sets up date name-->
              <span style="color:#ff0000">*</span>
              <input
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.date"
                type="date"
              /> <!-- gets reference from date in event v-model created below-->
              <span class="text-black" v-if="v$.event.date.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.event.date.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- prints error if there is an error in date submission-->
              </span>
            </label>
          </div> <!-- closes off div-->

          <div></div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Description</span> <!-- sets up description name in UI-->
              <textarea
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="2"
                v-model="event.description"
              ></textarea> <!-- references event v-model of description and gets information back from it-->
            </label>
          </div>

          <div></div>
          <div></div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col grid-cols-3">
            <label>Services Offered at Event</label> <!-- sets up label for services offered at event-->
            <div>
              <label for="familySupport" class="inline-flex items-center"> <!-- sets up input box in frontend-->
                <input
                  type="checkbox"
                  id="familySupport"
                  value="Family Support"
                  v-model="checkedServices"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  notchecked
                /> <!-- gets reference from event v-model of checkedServices-->
                <span class="ml-2">Family Support</span>
              </label>
            </div> <!-- closes div-->
            <div>
              <label for="adultEducation" class="inline-flex items-center"> <!--sets up input box in frontend-->
                <input
                  type="checkbox"
                  id="adultEducation"
                  value="Adult Education"
                  v-model="checkedServices"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  notchecked
                /> <!-- references checked services from event v-model-->
                <span class="ml-2">Adult Education</span> <!-- sets up checkbox for adult education-->
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
                /> <!-- references  event v-model in checkedservices-->
                <span class="ml-2">Youth Services Program</span> <!-- sets up checkbox for youth services program-->
              </label>
            </div>
            <div>
              <label for="childhoodEducation" class="inline-flex items-center">
                <input
                  type="checkbox"
                  id="childhoodEducation"
                  value="Early Childhood Education"
                  v-model="checkedServices"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  notchecked
                /> <!-- references checkedservices in event v-model-->
                <span class="ml-2">Early Childhood Education</span>
              </label>
            </div>
          </div>
        </div><!-- close out div-->

        <!-- grid container -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Address</h2> <!-- adds address line to eventdetails-->
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 1</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.line1"
              />
            </label><!-- references address line 1 in event v-model-->
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span> <!-- address line 2 form -->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.line2"
              />
            </label> <!-- references address line 2 in v-model-->
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span> <!-- form for adding city-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.city"
              />
            </label> <!-- references city in event v-model-->
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span> <!-- form for adding county-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.county"
              />
            </label> <!-- references count in event v-model-->
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span> <!-- form for adding zip code-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.address.zip"
              />
            </label> <!-- references zip code in event v-model-->
          </div>
        </div>

        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div class="flex justify-between mt-10 mr-20">
            <button
              @click="handleEventUpdate"
              type="submit"
              class="bg-red-700 text-white rounded"
            >Update Event</button> <!-- button for event updating, goes to handleeeventupdate-->
          </div>
          <!--delete button using delete method -->
          <div class="flex justify-between mt-10 mr-20">
            <button
              @click="deleteEvent"
              type="submit"
              class="bg-red-700 text-white rounded"
            >Delete Event</button> <!-- button for deleting event, goes to deleteevent-->
          </div>
          <div class="flex justify-between mt-10 mr-20">
            <button
              type="reset"
              class="border border-red-700 bg-white text-red-700 rounded"
              @click="$router.go(-1)"
            >Go back</button> <!-- go back to the previous page-->
          </div>
        </div>

        <hr class="mt-10 mb-10" />

        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div>
            <h2 class="text-2xl font-bold">List of Attendees</h2>
            <h3 class="italic">Click table row to edit/display/delete an entry</h3>
          </div>
          <div class="flex flex-col col-span-2">
            <table class="min-w-full shadow-md rounded" style="
          border: .5px solid black"> <!-- sets up div for listing attendees-->
              <thead class="bg-gray-50 text-xl">
                <tr>
                  <th class="p-4 text-left" style="
          border: .5px solid black">Name</th>
                  <th class="p-4 text-left" style="
          border: .5px solid black">City</th>
                  <th class="p-4 text-left" style="
          border: .5px solid black">Phone Number</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-300">
                <tr
                  @click="editClient(client.attendeeID)"
                  v-for="client in attendeeData"
                  :key="client._id"
                > <!-- you can edit a client in the list as well-->
                  <td
                    class="p-2 text-left"
                  >{{ client.attendeeFirstName + " " + client.attendeeLastName }}</td>
                  <td class="p-2 text-left">{{ client.attendeeCity }}</td>
                  <td class="p-2 text-left">{{ client.attendeePhoneNumber }}</td>
                </tr><!-- gets last name, city, and phone number of client and shows it on the list-->
              </tbody>
            </table>
          </div>
          <!-- List for removing clients  -->
          <div class="flex flex-col">
            <label class="typo__label">Select Clients to be removed</label> <!-- sets up div for removing clients-->
            <VueMultiselect
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="clientsChosen"
              :options="eventClients"
              :multiple="false"
              :searchable="false"
              :allowempty="true"
              :close-on-select="true"
              track-by="clientName"
              label="clientName"
              style="
              border: .5px solid black"
            ></VueMultiselect> <!-- makes a multiselect for clients.-->
            <div class="flex justify-between">
              <button
                @click="removeFromEvent"
                type="submit"
                class="mt-5 bg-red-700 text-white rounded"
              >Remove Client from Event</button> <!-- if you click on the button and select a client, it will be removed -->
            </div>
          </div>
        </div>
      </form>
    </div><!-- closes out div-->
  </main>
</template>
<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import axios from "axios";
import { DateTime } from "luxon"; //importing everything required
import VueMultiselect from "vue-multiselect";

export default {
  props: ["id"],
  components: { VueMultiselect }, //gets VueMultiselect from importation
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  }, //sets it up
  data() {
    return {
      clientsChosen: [],
      eventClients: [],
      attendeeIDs: [], //returns all datapoints
      attendeeData: [],
      checkedServices: [],
      event: { //returns event model
        eventName: "",
        services: [],
        date: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          county: "",
          zip: "",
        },
        description: "", //everything needed is returned
      },
    };
  },
  beforeMount() {
    axios
      .get( //before mounting, it gets all events based on id
        import.meta.env.VITE_ROOT_API + `/eventdata/id/${this.$route.params.id}`
      )
      .then((resp) => {
        let data = resp.data[0]; //gets first array from data
        this.event.eventName = data.eventName; //gets event name
        console.log(data.date);
        this.event.date = DateTime.fromISO(data.date).plus({ days: 1 }).toISODate(); //converts date
        this.event.description = data.description; //gets event description and date
        this.checkedServices = data.services;
        this.event.address = data.address; //gets address and service
        this.attendeeIDs = data.attendees;
        for (let i = 0; i < this.attendeeIDs.length; i++) { //for every id, get one
          axios
            .get(
              import.meta.env.VITE_ROOT_API +
                `/primarydata/id/${this.attendeeIDs[i]}` //gets every client based on id
            )
            .then((resp) => {
              let data = resp.data;
              this.attendeeData.push({
                attendeeID: this.attendeeIDs[i],
                attendeeFirstName: data.firstName, //pushes all data into previously created variables
                attendeeLastName: data.lastName,
                attendeeCity: data.address.city,
                attendeePhoneNumber: data.phoneNumbers[0].primaryPhone, //gets first objects in phoneNumbers
              });
            });
        }
      });
      axios //gets events based on id
      .get(
        import.meta.env.VITE_ROOT_API + `/eventdata/id/${this.$route.params.id}` //based on id in parameters
      )
      .then((resp) => {
        let data = resp.data[0];
        this.attendeeIDs = data.attendees;
        for (let i = 0; i < this.attendeeIDs.length; i++) { // for every attendee id, push into data var
          axios
            .get(
              import.meta.env.VITE_ROOT_API +
                `/primarydata/id/${this.attendeeIDs[i]}` //gets every client based on id in database
            )
            .then((resp) => {
              let data = resp.data; //pushes data into data var
              this.eventClients.push({
                clientID: this.attendeeIDs[i], //pushes client into into attendee id
                clientName: data.firstName + ' ' + data.lastName, //gets first name and last name
              });
            });
        }
      });
  },
  methods: {
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString(); //formats date as needed
    }, //into isodatetime
    async handleEventUpdate() {
      const isFormCorrect = await this.v$.$validate();
      if (isFormCorrect) {
      this.event.services = this.checkedServices;
      let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/${this.id}`;
      axios.put(apiURL, this.event).then((resp) => {
        alert(JSON.stringify(resp.data));
        this.$router.back().catch((error) => {
          console.log(error); //catch error and console log if there is an error from the backend
        });
      });
    }},
    //delete method to call delete event api
    deleteEvent(){
      let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/eventdata/${this.id}`;
      axios.delete(apiURL, this.client).then((resp) => {
        alert(JSON.stringify(resp.data));
        this.$router.back().catch((error) => {
          console.log(error); //if there is an error in the backend, then show it as well 
        });
      });
    },
    editClient(clientID) {
      this.$router.push({ name: "updateclient", params: { id: clientID } }); //update the clientid in the array 
    },// it has been deleted
    removeFromEvent() {
    let apiURL =
      import.meta.env.VITE_ROOT_API + `/eventdata/removeattendees/${this.$route.params.id}`; //gets route from eventdata backend
    axios.put(apiURL, { attendee: this.clientsChosen.clientID });
    alert("Client has been removed from event."); //alert if you actually removed the client
    this.$router.back().catch((error) => {
      console.log(error); //catches the error from the backend and sends to the frontend
      });
    },
  },
  // sets validations for the various data properties
  validations() {
    return {
      event: {
        eventName: { required }, //eventname is required
        date: { required }, //date is required
      },
    };
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>