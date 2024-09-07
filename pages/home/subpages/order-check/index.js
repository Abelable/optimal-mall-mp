import HomeService from "../../utils/homeService";

const homeService = new HomeService();

Page({
  data: {
    preOrderInfo: null,
    addressSelectPopupVisible: false
  },

  onLoad({ cartGoodsIds }) {
    this.cartGoodsIds = JSON.parse(cartGoodsIds);
    this.setPreOrderInfo();
  },

  async setPreOrderInfo() {
    const preOrderInfo = await homeService.getPreOrderInfo(
      this.cartGoodsIds,
      this.addressId
    );
    this.setData({ preOrderInfo });
  },

  showAddressSelectPopup() {
    this.setData({
      addressSelectPopupVisible: true
    });
  },

  confirmAddressSelect(e) {
    this.addressId = e.detail.id;
    this.setPreOrderInfo();
    this.hideAddressSelectPopup()
  },

  hideAddressSelectPopup() {
    this.setData({
      addressSelectPopupVisible: false
    });
  },

  // 提交订单
  async submit() {
    const { addressInfo, errMsg } = this.data.preOrderInfo;
    const addressId = addressInfo.id;
    if (!addressId) {
      return;
    }
    if (errMsg) {
      return;
    }
    const orderId = await homeService.submitOrder(this.cartGoodsIds, addressId);
    if (orderId) {
      this.pay(orderId);
    }
  },

  async pay(orderId) {
    const payParams = await homeService.getPayParams(orderId);
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
    }
  }
});
