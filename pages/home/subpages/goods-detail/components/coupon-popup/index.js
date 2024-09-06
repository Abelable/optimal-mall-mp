Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: Boolean,
    couponList: Array
  },

  methods: {
    showSpecPopup() {
      this.triggerEvent("showSpecPopup");
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
