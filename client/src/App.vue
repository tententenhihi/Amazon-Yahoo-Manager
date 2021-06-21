<template>
  <div id="app">
    <div class="page-wrapper chiller-theme toggled">
      <Sidebar v-if="isUserLoggedIn" />
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "./layouts/Header.vue";
import Sidebar from "./layouts/Sidebar.vue";

export default {
  name: "App",

  components: {
    Header,
    Sidebar
  },
  computed: {
    ...mapState(["isUserLoggedIn"])
  },
  data: () => ({
    //
  })
};
</script>
<style src="@/assets/css/reset.css"></style>
<style src="@/assets/css/common.css"></style>
<style src="@/assets/css/style.css"></style>

<style>
body {
  min-height: 100vh;
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
