Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    addressList: Array,
    show: Boolean
  },

  data: {
    selectedIndex: 0
  },

  methods: {
    selectAddress(e) {
      this.setData({
        selectedIndex: Number(e.detail.value)
      });
    },

    confirm() {
      this.triggerEvent("confirm", { index: this.data.selectedIndex });
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
