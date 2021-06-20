<template>
  <div class="px-10 py-5 pb-10">
    <v-card style="width: 100%;">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          style="max-width: 200px"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="listAsin" :search="search">
        <template v-slot:[`item.stt`]="{ item }">
          {{ listAsin.indexOf(item) + 1 }}
        </template>
        <template v-slot:[`item.created`]="{ item }">
          {{ $moment(item.created).format("DD/MM/YYYY") }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "NO",
          value: "stt"
        },
        { text: "Group ID", value: "groupId" },
        { text: "Count Asin", value: "countAsin" },
        { text: "Count Asin Geted Product", value: "countAsinGetProductSuccess" },
        { text: "Created", value: "created" }
      ]
    };
  },
  props: ["listAsin"]
};
</script>

<style></style>
