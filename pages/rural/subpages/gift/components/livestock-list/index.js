Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array
  },

  methods: {
    navToGoodsDetail(e) {
      wx.navigateTo({
        url: `/pages/home/subpages/goods-detail/index?id=${e.currentTarget.dataset.id}`
      });
    }
  }
});
