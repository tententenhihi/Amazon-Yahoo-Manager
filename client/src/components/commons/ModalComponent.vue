<template>
  <div class="modal fade show" :ref="ref" :id="idModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document" :class="classModalDialog">
      <div class="modal-content modal-success">
        <div class="modal-header" v-if="isModalHeader">
          <div class="title">
            <slot name="header"></slot>
          </div>
        </div>
        <div class="modal-body py-20" v-if="isModalBody">
          <slot></slot>
        </div>
        <div class="modal-footer pt-10" :style="styleModalFooter">
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
    isModalBody: {
      type: Boolean,
      default: true
    },
    classModalDialog: {
      type: String,
      default: ''
    },
    styleModalFooter: {
      type: String,
      default: ''
    }
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
<style>
@media (min-width: 992px) {
  .modal-lg {
    max-width: 900px !important;
  }
}
</style>