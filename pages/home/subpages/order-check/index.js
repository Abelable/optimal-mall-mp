import { calcDistance } from "../../../../utils/index";
import HomeService from "../../utils/homeService";

const homeService = new HomeService();

Page({
  data: {
    goodsDeliveryMethod: 1,
    curMenuIdx: 0,
    preOrderInfo: null,
    addressPopupVisible: false,
    distance: 0,
    pickupAddressPopupVisible: false,
    pickupTime: "",
    pickupTimePopupVisible: false,
    couponPopupVisible: false
  },

  onLoad({ cartGoodsIds, deliveryMethod }) {
    this.cartGoodsIds = JSON.parse(cartGoodsIds);

    const goodsDeliveryMethod = +deliveryMethod;
    this.setData({ goodsDeliveryMethod });
    if (goodsDeliveryMethod !== 1) {
      this.setLocationInfo();
    }

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

  async setLocationInfo() {
    const { longitude, latitude } = await homeService.getLocationInfo();
    this.lo1 = longitude;
    this.la1 = latitude;
  },

  setDistance() {
    const distance = calcDistance(this.la1, this.lo1, la2, lo2);
    this.setData({ distance })
  },

  navigation() {
    const { name, address, latitude, longitude } = this.data.hotelInfo;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address
    });
  },

  selectMenu(e) {
    const curMenuIdx = +e.currentTarget.dataset.index;
    this.setData({ curMenuIdx });
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

  showPickupAddressPopup() {
    this.setData({
      pickupAddressPopupVisible: true
    });
  },

  confirmPickupAddressSelect(e) {
    this.pickupAddressId = e.detail.id;
    // this.setPreOrderInfo();
    this.hidePickupAddressPopup();
  },

  hidePickupAddressPopup() {
    this.setData({
      pickupAddressPopupVisible: false
    });
  },

  showPickupTimePopup() {
    this.setData({
      pickupTimePopupVisible: true
    });
  },

  confirmPickupTimeSelect(e) {
    // this.setPreOrderInfo();
    this.hidePickupTimePopup();
  },

  hidePickupTimePopup() {
    this.setData({
      pickupTimePopupVisible: false
    });
  },

  toggleUseBalance(e) {
    this.useBalance = e.detail.value;
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
      this.useBalance ? 1 : 0
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
