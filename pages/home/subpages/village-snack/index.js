import HomeService from "../../utils/homeService";

const homeService = new HomeService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    bannerList: [],
    topGoodsList: [],
    goodsList: []
  },

  async onLoad() {
    this.setGoodsList();
  },

  async setGoodsList() {
    const goodsList = (await homeService.getSnackGoodsList()) || [];
    if (goodsList.length) {
      this.setData({
        topGoodsList: goodsList.slice(0, 2),
        goodsList: goodsList.slice(2)
      });
    }
  },

  onPullDownRefresh() {
    this.setGoodsList();
    wx.stopPullDownRefresh();
  }
});
