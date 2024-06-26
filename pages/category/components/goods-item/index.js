Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  data: {
    visible: false
  },

  methods: {
    onCoverLoaded() {
      this.setData({ visible: true });
    },

    navToGoodsDetail() {
      wx.navigateTo({
        url: `/pages/home/subpages/goods-detail/index?id=${this.properties.item.id}`
      });
    }
  }
});
