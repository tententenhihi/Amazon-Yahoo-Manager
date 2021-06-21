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
        <template v-slot:[`item.actions`]="{ item }">
          <span
            style="color: blue; cursor: pointer"
            @click="
              groupAsinDetail = item;
              showDialogDetail = true;
            "
            >Detail</span
          >
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="showDialogDetail" max-width="500px">
      <v-card v-if="groupAsinDetail">
        <v-card-title>{{ groupAsinDetail.groupId }}</v-card-title>
        <v-card-text>
          <table>
            <tr v-for="(item, index) in groupAsinDetail.asins" :key="index">
              <th class="font-weight-bold">{{ item.code }}:</th>
              <td>{{ item.status }}: {{ item.statusMessage }}</td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      showDialogDetail: false,
      groupAsinDetail: null,
      headers: [
        {
          text: "NO",
          value: "stt"
        },
        { text: "Group ID", value: "groupId" },
        { text: "Count Asin", value: "countAsin" },
        {
          text: "Count Asin Geted Product",
          value: "countAsinGetProductSuccess"
        },
        { text: "Created", value: "created" },
        { text: "Actions", value: "actions" }
      ]
    };
  },
  props: ["listAsin"]
};
</script>

<style></style>
