<template><!-- starts vuejs code-->
  <main>
    <div style="
          border-radius: 7px;
          border: 2.5px solid black">
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Find Client</h1>
    </div>
    <div class="px-10 pt-20" >
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10" >
        <h2 class="text-2xl font-bold">Search Client By</h2> <!--sets up search by box-->
        <!-- Displays Client Name search field -->
        <div class="flex flex-col" > <!-- select box-->
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="searchBy"
          > <!-- references searchby in event model-->
            <option value="Client Name">Client Name</option>
            <option value="Client Number">Client Number</option>
          </select>
        </div>
        <div class="flex flex-col" v-if="searchBy === 'Client Name'"> <!-- sets up search by client name box-->
          <label class="block">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="firstName"
              v-on:keyup.enter="handleSubmitForm"
              placeholder="Enter first name"
            /> <!-- if they enter a name, they can click the submit button-->
          </label>
        </div>
        <div class="flex flex-col" v-if="searchBy === 'Client Name'">
          <label class="block">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="lastName"
              v-on:keyup.enter="handleSubmitForm"
              placeholder="Enter last name"
            /> <!-- if they enter a name, they click the submit button-->
          </label>
        </div>
        <!-- Displays Client Number search field -->
        <div class="flex flex-col" v-if="searchBy === 'Client Number'"> <!-- input box-->
          <input
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            v-model="phoneNumber"
            v-on:keyup.enter="handleSubmitForm"
            placeholder="Enter Client Phone Number"
          /> <!-- sets up input for phone number and click button-->
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
          >Clear Search</button> <!-- send to clear search by @click-->
          <button
            class="bg-red-700 text-white rounded"
            @click="handleSubmitForm"
            type="submit"
          >Search Client</button> <!-- button for searching, send to submit by @click-->
        </div>
      </div>
    </div>

    <hr class="mt-10 mb-10" />
    <!-- Display Found Data -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Clients</h2> <!-- sets up div for listing clients-->
        <h3 class="italic">Click table row to edit/display/delete an entry</h3>
      </div>
      <div class="flex flex-col col-span-2"> <!-- sets up div for list-->
        <table class="min-w-full shadow-md rounded" style="
          border: .5px solid black">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left" style="
          border: .5px solid black">Name</th>
              <th class="p-4 text-left" style="
          border: .5px solid black">Phone number</th>
              <th class="p-4 text-left" style="
          border: .5px solid black">City</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="editClient(client._id)" v-for="client in queryData" :key="client._id"> <!--if you click edit, it sends you to the editclient form-->
              <td class="p-2 text-left">{{ client.firstName + " " + client.lastName }}</td>
              <td class="p-2 text-left">{{ client.phoneNumbers[0].primaryPhone }}</td>
              <td class="p-2 text-left">{{ client.address.city }}</td>
            </tr> <!-- prints out firstname, lastname, phonenumbers, city -->
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<script>
import axios from "axios"; //imports what is needed

export default {
  data() {
    return {
      queryData: [],
      //Parameter for search to occur
      searchBy: "",
      firstName: "",
      lastName: "", //search parameters
      phoneNumber: "",
    };
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/`;
    axios.get(apiURL).then((resp) => {
      this.queryData = resp.data; //mounts gets from /primarydata in backend
    });
    window.scrollTo(0, 0);
  },
  methods: {
    handleSubmitForm() { //submit button
      let apiURL = "";
      if (this.searchBy === "Client Name") {
        apiURL =
          import.meta.env.VITE_ROOT_API + //search by firstname and last name
          `/primarydata/search/?firstName=${this.firstName}&lastName=${this.lastName}&searchBy=name`;
      } else if (this.searchBy === "Client Number") {
        apiURL =
          import.meta.env.VITE_ROOT_API + //search by phone numbers
          `/primarydata/search/?phoneNumbers.primaryPhone=${this.phoneNumber}&searchBy=number`;
      }
      axios.get(apiURL).then((resp) => {
        if (resp.data == 'Client not found') {
          alert(JSON.stringify(resp.data));
        }
        else {
        this.queryData = resp.data; } //send querydata to response data 
      });
    },
    clearSearch() { //clear search button
      //Resets all the variables
      this.searchBy = "";
      this.firstName = ""; //resets all variables if you click clear search button
      this.lastName = "";
      this.phoneNumber = "";

      //get all entries
      let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/`;
      axios.get(apiURL).then((resp) => { //gets all entries from primarydata
        this.queryData = resp.data; //sends to response data
      });
    },
    editClient(clientID) {
      this.$router.push({ name: "updateclient", params: { id: clientID } }); //pushes to edit client
    },
  },
};
</script>
