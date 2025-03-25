Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: Boolean
  },

  data: {
    minDate: new Date().getTime(),
  },

  methods: {
    confirm(e) {
      const time = e.detail
      this.triggerEvent("confirm", { time });
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
