Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: Boolean,
    refundStatus: Number
  },

  methods: {
    hide() {
      this.triggerEvent("hide");
    }
  }
});
