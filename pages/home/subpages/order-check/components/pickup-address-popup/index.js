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

    navigation(e) {
      const { index } = e.currentTarget.dataset;
      const { name, addressDetail, longitude, latitude } =
        this.properties.addressList[index];
      wx.openLocation({
        latitude: +latitude,
        longitude: +longitude,
        name: name || addressDetail,
        address: addressDetail
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
