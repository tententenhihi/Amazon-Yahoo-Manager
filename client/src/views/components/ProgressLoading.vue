<template>
  <div class="container-progress">
    <div class="progress">
      <div
        class="progress-bar progress-bar-striped"
        role="progressbar"
        :style="`width: ${persent}%`"
        aria-valuenow="10"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
      <div
        v-if="progressData"
        style="position: absolute; text-align: center; right: 0; left: 0"
      >
        <span>
          {{ progressData.progress }} / {{ this.progressData.total }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["progressData"],
  computed: {
    persent() {
      if (!this.progressData || !this.progressData.progress) {
        return 0;
      }
      let progress = this.progressData.progress / this.progressData.total;
      progress = progress * 100;
      return progress;
    },
  },
};
</script>

<style scoped>
.container-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
}
.progress {
  width: 30vw;
  position: relative;
}
</style>