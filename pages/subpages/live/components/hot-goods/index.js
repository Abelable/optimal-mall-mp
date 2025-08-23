Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    goodsInfo: Object,
  },

  methods: {
    navToGoodsDetail() {
      const { id } = this.properties.goodsInfo;
      const url = `/pages/home/subpages/goods-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
