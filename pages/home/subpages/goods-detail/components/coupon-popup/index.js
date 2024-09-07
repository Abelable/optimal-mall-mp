Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          const { basePrice, couponList } = this.properties;
          const { denomination, type, numLimit, priceLimit } = couponList[0];
          let discountTitle = "";
          let discountPrice = 0;
          let totalPrice = 0;
          switch (type) {
            case 1:
              discountTitle = "无门槛券，您可享受以下优惠";
              discountPrice =
                Math.floor((basePrice - denomination) * 100) / 100;
              break;
            case 2:
              discountTitle = `购买${numLimit}件，享受以下优惠`;
              discountPrice =
                Math.floor(
                  ((basePrice * numLimit - denomination) / numLimit) * 100
                ) / 100;
              totalPrice =
                Math.floor(basePrice * numLimit * 100) / 100;
              break;
            case 3:
              discountTitle = `满${priceLimit}元，享受以下优惠`;
              discountPrice = Math.floor((priceLimit - denomination) * 100) / 100;
              break;
          }
          this.setData({ discountTitle, discountPrice, totalPrice });
        }
      }
    },
    basePrice: Number,
    couponList: Array
  },

  data: {
    discountTitle: "",
    discountPrice: 0,
    totalPrice: 0
  },

  methods: {
    showSpecPopup() {
      this.triggerEvent("showSpecPopup");
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
