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
      console.log('time_pick', e)
      this.triggerEvent("confirm", { id });
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
