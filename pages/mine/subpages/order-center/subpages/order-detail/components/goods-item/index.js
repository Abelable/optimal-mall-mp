const dayjs = require("dayjs");

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    orderId: Number,
    orderSn: String,
    status: Number,
    couponId: Number,
    merchantId: Number,
    confirmTime: String
  },

  data: {
    refundBtnVisible: false
  },

  lifetimes: {
    attached() {
      const { status, confirmTime, item } = this.properties;
      if (
        [401, 402, 403, 501].includes(status) &&
        item.refundStatus === 1 &&
        dayjs(confirmTime).diff(dayjs().valueOf(), "day") <= 7
      ) {
        this.setData({ refundBtnVisible: true });
      }
    }
  },

  methods: {
    navToGoodsDetail() {
      const { id } = this.properties.item;
      const url = `/pages/home/subpages/goods-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    applyRefund() {
      const { orderId, orderSn, couponId, item } = this.properties;
      const { goodsId, merchantId } = item;
      const url = `/pages/mine/subpages/order-center/subpages/refund/index?orderId=${orderId}&orderSn=${orderSn}&couponId=${couponId}&goodsId=${goodsId}&marchantId=${merchantId}`;
      wx.navigateTo({ url });
    }
  }
});
