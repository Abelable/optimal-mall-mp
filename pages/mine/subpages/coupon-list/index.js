import CouponService from "./utils/couponService";

const couponService = new CouponService();

Page({
  data: {
    couponList: []
  },

  onShow() {
    this.setCouponList();
  },

  async setCouponList() {
    const couponList = (await couponService.getCouponList()) || [];
    this.setData({ couponList });
  },
});
