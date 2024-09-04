Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
  },

  data: {
    visible: false,
    bottomPrice: 0
  },

  lifetimes: {
    attached() {
      const { price, couponList = [] } = this.properties.item;

      if (couponList.length) {
        const bottomPrice = couponList.map(
          ({ type, numLimit, priceLimit, denomination }) => {
            switch (type) {
              case 1:
                return Math.floor((price - denomination) * 100) / 100;
              case 2:
                return (
                  Math.floor(
                    ((price * numLimit - denomination) / numLimit) * 100
                  ) / 100
                );
              case 3:
                return priceLimit <= price
                  ? Math.floor((price - denomination) * 100) / 100
                  : 0;
            }
          }
        )[0];
        this.setData({ bottomPrice });
      }
    }
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
