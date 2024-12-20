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
                Math.round((basePrice - denomination) * 100) / 100;
              break;
            case 2:
              discountTitle = `购买${numLimit}件，享受以下优惠`;
              discountPrice =
                Math.round(
                  ((basePrice * numLimit - denomination) / numLimit) * 100
                ) / 100;
              totalPrice = Math.round(basePrice * numLimit * 100) / 100;
              break;
            case 3:
              discountTitle = `满${priceLimit}元，享受以下优惠`;
              discountPrice =
                Math.round((priceLimit - denomination) * 100) / 100;
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
      this.hide();
      this.triggerEvent("showSpecPopup");
    },

    receive(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent("receive", { index });
    },

    share() {
      this.hide();
      this.triggerEvent("share");
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
