Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: {
      type: Object,
      observer({ stock, salesVolume }) {
        const percent = Math.floor((salesVolume / stock) * 100);
        this.setData({ percent });
      }
    }
  },

  data: {
    visible: false,
    percent: 0
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
