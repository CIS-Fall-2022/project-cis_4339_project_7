<script>
import useVuelidate from "@vuelidate/core"; //imports vuelidate
import { required, email, alpha, numeric } from "@vuelidate/validators"; //imports required from vuelidate
import axios from "axios"; //imports axios
export default {
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  }, //sets up vuelidate for validation of data input
  mounted() {
    window.scrollTo(0, 0); 
  },
  data() {
    return {
      client: {
        firstName: "",
        middleName: "",
        lastName: "", //sets up returned data from client model
        email: "",
        phoneNumbers: [
          {
            primaryPhone: "",
            secondaryPhone: "",
          },
        ],
        address: {
          line1: "",
          line2: "",
          city: "",
          county: "", //address, phone numbers, emails, and names
          zip: "",
        },
      },
    };
  },
  methods: {
    async handleSubmitForm() {
      // Checks to see if there are any errors in validation
      const isFormCorrect = await this.v$.$validate();
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect) {
        let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/`;
        axios //gets all clients from backend route in primarydata.js
          .post(apiURL, this.client)
          .then(() => {
            alert("Client has been succesfully added.");
            this.$router.back().catch((error) => { //go back a page if error caught
            console.log(error);//if error, take error from backend and push to frontend
            this.$router.push("/findclient"); //pushes to findclient.vue
            this.client = {
              firstName: "",
              middleName: "", //all fields in .client
              lastName: "",
              email: "",
              phoneNumbers: [
                {
                  primaryPhone: "",
                  seondaryPhone: "",
                },
              ],
              address: {
                line1: "",
                line2: "",
                city: "", //address, phonenumbers, email, and names
                county: "",
                zip: "",
              },
            };
          })
          .catch((error) => {
            console.log(error);
          });
        })}
  }},
  // sets validations for the various data properties
  validations() {
    return {
      client: { //sets up validations for firstname, lastname, email, etc..
        firstName: { required, alpha },
        lastName: { required, alpha }, //alpha means it has to be alphabets
        email: { email }, //has to be email format
        address: {
          city: { required },
        },
        phoneNumbers: [
          {
            primaryPhone: { required, numeric }, //required and in numeric format
          },
        ],
      },
    };
  },
};
</script>
<template>
  <main><div style="
          border-radius: 7px;
          border: 2.5px solid black">
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Client Intake Form</h1></div>
    <div class="px-10 py-20" style="
          background: linear-gradient(140deg, #ffffff
 70%, #BEC4D4 50.6%);
          border-radius: 7px;
          border: 2.5px solid black">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm"> <!-- submit button reference-->
        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Personal Details</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">First Name</span>
              <span style="color:#ff0000">*</span> <!-- sets up input for firstname-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.firstName"
              /> <!-- references first name in v-model-->
              <span class="text-black" v-if="v$.client.firstName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.firstName.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- if errors, then show errors to front end-->
              </span>
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Middle Name</span> <!-- sets up input for middle name-->
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
              <span class="text-gray-700">Last Name</span>
              <span style="color:#ff0000">*</span> <!-- sets up input for last name-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="client.lastName"
              /> <!-- references last name in v-model-->
              <span class="text-black" v-if="v$.client.lastName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.lastName.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- if there is an error then show error message-->
              </span>
            </label>
          </div>

          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Email</span> <!--sets up input for email-->
              <input
                type="email"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                v-model="client.email"
              /><!-- references email in v-model -->
              <span class="text-black" v-if="v$.client.email.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.email.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p> <!-- if error , then show error message in front end-->
              </span>
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Phone Number</span> <!-- sets up input for phone number-->
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                v-model="client.phoneNumbers[0].primaryPhone"
              /> <!-- references object 0 in the phonenumber array-->
              <span class="text-black" v-if="v$.client.phoneNumbers[0].primaryPhone.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.phoneNumbers[0].primaryPhone.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p><!--if error then show error message in frontend-->
              </span>
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Alternative Phone Number</span><!-- sets up input box for phone number-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                v-model="client.phoneNumbers[0].secondaryPhone"
              /><!-- references secondaryphone in v-model-->
            </label>
          </div>
        </div>

        <!-- grid container -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Address Details</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block"><!-- sets up input box for address line 1-->
              <span class="text-gray-700">Address Line 1</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line1"
              /><!-- references line 1 in v-model-->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span> <!-- sets up input box for address line 2-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line2"
              /><!-- references line 2 in v-model-->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span>
              <span style="color:#ff0000">*</span><!-- sets up city input-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.city"
              /><!-- references in city v-model-->
              <span class="text-black" v-if="v$.client.address.city.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.address.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p><!--if error then show error message-->
              </span>
            </label>
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span><!-- sets up input for county-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.county"
              /><!-- references county in v-model-->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span><!--  sets up input for zip code-->
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.zip"
              /><!-- references zip code in v-model-->
            </label>
          </div>
          <div></div>
          <!-- submit button -->
          <div class="flex justify-between mt-10 mr-20">
            <button class="bg-red-700 text-white rounded" type="submit">Add Client</button>
          </div><!-- submit button for adding client-->
        </div>
      </form>
    </div>
  </main>
</template>
