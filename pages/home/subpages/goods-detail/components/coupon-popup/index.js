Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: Boolean,
    couponList: Array
  },

  methods: {
    hide() {
      this.triggerEvent("hide");
    }
  }
});
