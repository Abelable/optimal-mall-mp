Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array
  },

  methods: {
    navToGoodsDetail() {
      wx.navigateTo({
        url: `/pages/home/subpages/goods-detail/index?id=${this.properties.item.id}`
      });
    }
  }
});
