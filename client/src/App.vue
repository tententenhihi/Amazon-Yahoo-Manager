<template>
  <div id="app">
    <v-app style="height: 100%">
      <v-main id="main" style="height: 100%">
        <Header v-if="isUserLoggedIn" />
        <router-view />
      </v-main>
      <div />
    </v-app>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "./layouts/Header.vue";

export default {
  name: "App",

  components: {
    Header
  },
  computed: {
    ...mapState(["isUserLoggedIn"])
  },
  data: () => ({
    //
  })
};
</script>
<style>
.v-slide-group__content {
  border-bottom: 1px solid gray;
}
#main {
  overflow-y: auto;
}
.stt-table {
  min-width: 70px;
}
.col-delivery-table {
  min-width: 100px;
}
.col-image-table {
  min-width: 90px;
}
.small-radio i {
  font-size: 19px;
}
.small-radio label {
  font-size: 14px;
  padding-left: 0px;
  margin-left: -4px;
  font-weight: 400;
  color: black !important;
}
.small-radio .v-radio {
  padding: 0px;
}
.small-radio [class*="__ripple"] {
  left: 0;
}

.radius-20 {
  border-radius: 20px;
}
.v-tabs-slider-wrapper {
  height: 0px !important;
}
.v-tab--active {
  color: black !important;
  font-weight: bold;
}
.v-application {
  font-family: "Roboto", "Arial", sans-serif !important;
  font-weight: 400 !important;
}
html {
  overflow-y: hidden !important;
}
body {
  height: 100vh;
  font-family: "Roboto", "Arial", sans-serif !important;
  font-weight: 400 !important;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  font-family: "Roboto", "Arial", sans-serif !important;
  font-weight: 400 !important;
}

.v-btn {
  text-transform: none !important;
}

.reset {
  margin: 0px !important;
  padding: 0px !important;
}
.color-picker-container {
  box-shadow: 1px 1px 10px black !important;
}
.text-bold {
  font-weight: bold;
}
.truncate-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.fa-trash-alt:hover {
  color: red;
}
.span-fix-header-fixed {
  display: table-cell;
}
.fs-16 {
  font-size: 16px !important;
}
.fs-15 {
  font-size: 15px !important;
}

.fs-14 {
  font-size: 14px !important;
}
.fs-12 {
  font-size: 12px !important;
}
.fs-10 {
  font-size: 10px !important;
}
.fs-sm {
  font-size: 0.875rem !important;
}
.fs-md {
  font-size: 1rem !important;
}
.fs-lg {
  font-size: 1.25rem !important;
}
.fs-xl {
  font-size: 1.5rem !important;
}
.btn-radius {
  border-radius: 50px !important;
}
.text-gray {
  color: rgb(100, 100, 100);
}
</style>
