import IntegrityService from "./utils/integrityService";

const integrityService = new IntegrityService();

Page({
  data: {
    bannerList: [],
    goodsList: []
  },

  async onLoad() {
    this.setBannerList();
    this.setGoodsList();
  },

  async setBannerList() {
    const bannerList = await integrityService.getBannerList();
    this.setData({ bannerList });
  },

  async setGoodsList() {
    const goodsList =
      (await integrityService.getGoodsList()) || [];
    this.setData({ goodsList });
  },

  onPullDownRefresh() {
    this.setGoodsList();
    wx.stopPullDownRefresh();
  }
});
