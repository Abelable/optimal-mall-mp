import HomeService from "../../utils/homeService";

const homeService = new HomeService();

Page({
  data: {
    preOrderInfo: null,
    addressPopupVisible: false,
    couponPopupVisible: false
  },

  onLoad({ cartGoodsIds }) {
    this.cartGoodsIds = JSON.parse(cartGoodsIds);
    this.setPreOrderInfo();
  },

  async setPreOrderInfo() {
    const preOrderInfo = await homeService.getPreOrderInfo(
      this.cartGoodsIds,
      this.addressId,
      this.couponId,
      this.useBalance
    );
    this.setData({ preOrderInfo });
  },

  showAddressPopup() {
    this.setData({
      addressPopupVisible: true
    });
  },

  confirmAddressSelect(e) {
    this.addressId = e.detail.id;
    this.setPreOrderInfo();
    this.hideAddressPopup();
  },

  hideAddressPopup() {
    this.setData({
      addressPopupVisible: false
    });
  },

  toggleUseBalance(e) {
    this.useBalance = e.detail.value
    this.setPreOrderInfo();
  },

  showCouponPopup() {
    this.setData({
      couponPopupVisible: true
    });
  },

  confirmCouponSelect(e) {
    this.couponId = e.detail.id;
    this.setPreOrderInfo();
    this.hideCouponPopup();
  },

  hideCouponPopup() {
    this.setData({
      couponPopupVisible: false
    });
  },

  // 提交订单
  async submit() {
    const { errMsg, addressInfo, couponList } = this.data.preOrderInfo;
    const addressId = addressInfo.id;
    if (!addressId) {
      return;
    }
    if (errMsg) {
      return;
    }
    if (this.couponId === undefined && couponList.length) {
      this.couponId = couponList[0].id;
    }
    const orderIds = await homeService.submitOrder(
      this.cartGoodsIds,
      addressId,
      this.couponId,
      this.useBalance ? 1 : 0,
    );
    if (orderIds) {
      this.pay(orderIds);
    }
  },

  async pay(orderIds) {
    const payParams = await homeService.getPayParams(orderIds);
    if (payParams) {
      wx.requestPayment({
        ...payParams,
        success: () => {
          wx.navigateTo({
            url: "/pages/mine/subpages/order-center/index?status=2"
          });
        },
        fail: () => {
          wx.navigateTo({
            url: "/pages/mine/subpages/order-center/index?status=1"
          });
        }
      });
    } else if (this.useBalance) {
      wx.navigateTo({
        url: "/pages/mine/subpages/order-center/index?status=2"
      });
    }
  }
});
