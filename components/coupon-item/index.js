Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
  },

  methods: {
    navToGoodsDetail() {
      wx.navigateTo({
        url: `/pages/home/subpages/goods-detail/index?id=${this.properties.item.id}`
      });
    }
  }
});
