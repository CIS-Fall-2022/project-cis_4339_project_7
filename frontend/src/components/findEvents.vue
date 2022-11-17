<template>
  <main>
    <div style="
          border-radius: 7px;
          border: 2.5px solid black">
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">List of Events</h1>
    </div>
    <div class="px-10 pt-20"> <!-- sets up search event by field div-->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Search Event By</h2>
        <!-- Displays Client Name search field -->
        <div class="flex flex-col">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="searchBy"
          ><!-- references searchby in v-model-->
            <option value="Event Name">Event Name</option>
            <option value="Event Date">Event Date</option> <!-- you can select eventname or eventdate-->
          </select>
        </div>
        <div class="flex flex-col" v-if="searchBy === 'Event Name'"> <!-- if searchby = eventname-->
          <label class="block">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="eventName"
              v-on:keyup.enter="handleSubmitForm"
              placeholder="Enter event name"
            /> <!--enter event name, and you can click the submit button-->
          </label>
        </div>
        <!-- Displays event date search field -->
        <div class="flex flex-col" v-if="searchBy === 'Event Date'"> <!-- if you search by event date-->
          <input
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="date"
            v-model="eventDate"
            v-on:keyup.enter="handleSubmitForm"
          /> <!-- enter event date and you can click the submit button-->
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div></div>
        <div></div>
        <div class="mt-5 grid-cols-2">
          <button
            class="mr-10 border border-red-700 bg-white text-red-700 rounded"
            @click="clearSearch"
            type="submit"
          >Clear Search</button> <!-- clear search button sends to @click-->
          <button
            class="bg-red-700 text-white rounded"
            @click="handleSubmitForm"
            type="submit"
          >Search Event</button> <!-- submit button sends to @click-->
        </div>
      </div>
    </div>

    <hr class="mt-10 mb-10" />
    <!-- Display Found Data -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Events</h2> <!-- sets up div to see the list of events-->
        <h3 class="italic">Click table row to edit/delete/display an entry</h3>
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded" style="
          border: .5px solid black">
          <thead class="bg-gray-50 text-xl">
            <tr> <!-- all variables listed-->
              <th class="p-4 text-left" style="
          border: .5px solid black">Event Name</th>
              <th class="p-4 text-left" style="
          border: .5px solid black">Event Date</th>
              <th class="p-4 text-left" style="
          border: .5px solid black">Event Address</th>
              <th class="p-4 text-left" style="
          border: .5px solid black">Description</th> <!-- event name, event date, address, description-->

            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="editEvent(event._id)" v-for="event in queryData" :key="event._id"> <!-- for edit button, if you click it-->
              <td class="p-2 text-left">{{ event.eventName }}</td>
              <td class="p-2 text-left">{{ formattedDate(event.date) }}</td>
              <td class="p-2 text-left">{{ event.address.line1 }}</td>
              <td class="p-2 text-left">{{ event.description }}</td>
            </tr> <!-- grabs event name, eventdate, address, and description-->
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<script>
import { DateTime } from "luxon"; // imports datetime for date conversion
import axios from "axios"; //imports axios

export default {
  data() {
    return {
      queryData: [],
      //Parameter for search to occur
      searchBy: "",// query parameters
      eventName: "",
      eventDate: "",
    };
  },
  mounted() { //mounts
    let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/`;
    this.queryData = []; //imports from /eventdata backend route into a querydata var
    axios.get(apiURL).then((resp) => {
      this.queryData = resp.data;
    });
    window.scrollTo(0, 0); //scrolls windows
  },
  methods: {
    formattedDate(datetimeDB) { //formats date into the correct specification
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
    handleSubmitForm() {
      let apiURL = "";
      if (this.searchBy === "Event Name") { //sets up search 
        apiURL =
          import.meta.env.VITE_ROOT_API + //gets search url from backend
          `/eventdata/search/?eventName=${this.eventName}&searchBy=name`; //search by eventname
      } else if (this.searchBy === "Event Date") {
        apiURL =
          import.meta.env.VITE_ROOT_API + //gets search url from backend
          `/eventdata/search/?date=${this.eventDate}&searchBy=date`;
      } //search by date
      axios.get(apiURL).then((resp) => {
        if (resp.data == 'Event not found') {
          alert(JSON.stringify(resp.data)); //if there is nothing that matches, alert event not found
        }
        else {
        this.queryData = resp.data;} //otherwise query the data
      });
    },
    clearSearch() {
      //Resets all the variables
      this.searchBy = "";
      this.eventName = ""; //clears all variables
      this.eventDate = "";

      //get all entries
      let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/events`;
      this.queryData = [];
      axios.get(apiURL).then((resp) => { //gets all events from the backend route
        this.queryData = resp.data;
      });
    },
    editEvent(eventID) {
      this.$router.push({ name: "eventdetails", params: { id: eventID } }); //if you want to edit the events
    },
  },
};
</script>