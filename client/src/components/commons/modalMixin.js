export const modalMixin = {
  props: {
    onHideModal: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      ref: 'modal',
    }
  },
  mounted () {
    // eslint-disable-next-line
    $(this.$refs[this.ref]).on("hidden.bs.modal", this.onHideModal)
  },
  destroyed () {
    // eslint-disable-next-line
    $('.modal-backdrop').remove();
    // eslint-disable-next-line
    $('body').removeClass('modal-open');
  },
  methods: {
    openModal () {
      // eslint-disable-next-line
      $(this.$refs[this.ref]).modal('show');
    },
    closeModal () {
      // eslint-disable-next-line
      $(this.$refs[this.ref]).modal('hide');
    }
  }
};

export default modalMixin;
