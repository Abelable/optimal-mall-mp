import BaseService from "../../../../services/baseService";

const baseService = new BaseService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  data: {
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
                return Math.round((price - denomination) * 100) / 100;
              case 2:
                return (
                  Math.round(
                    ((price * numLimit - denomination) / numLimit) * 100
                  ) / 100
                );
              case 3:
                return priceLimit <= price
                  ? Math.round((price - denomination) * 100) / 100
                  : 0;
            }
          }
        )[0];
        this.setData({ bottomPrice });
      }
    }
  },

  methods: {
    async addCart() {
      const cartGoodsNumber = await baseService.addCart(
        this.properties.item.id
      );
      if (cartGoodsNumber) {
        wx.showToast({
          title: "成功添加购物车",
          icon: "none"
        });
        this.triggerEvent("addCartSuccess");
      }
    },

    navToGoodsDetail() {
      wx.navigateTo({
        url: `/pages/home/subpages/goods-detail/index?id=${this.properties.item.id}`
      });
    }
  }
});
