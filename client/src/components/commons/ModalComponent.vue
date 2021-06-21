<template>
  <div class="modal fade show" :ref="ref" :id="idModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content modal-success">
        <div class="modal-header" v-if="isModalHeader">
          <div class="title">
            <slot name="header"></slot>
          </div>
        </div>
        <div class="modal-body py-20">
          <slot></slot>
        </div>
        <div class="modal-footer pt-10">
          <slot name="button"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from './modalMixin';

export default {
  mixins: [modalMixin],
  name: 'ModalSuccess',
  props: {
    idModal: {
      type: String,
      default: 'idModal'
    },
    isModalHeader: {
      type: Boolean,
      default: true
    },
  },
  data () {
    return {
      ref: 'modalComponent'
    }
  },
  computed: {
  },
}
</script>

<style scoped>

</style>
