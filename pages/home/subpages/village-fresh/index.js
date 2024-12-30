import IntegrityService from "./utils/integrityService";

const integrityService = new IntegrityService();
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
    const goodsList = (await integrityService.getGoodsList()) || [];
    this.setData({
      topGoodsList: goodsList.slice(0, 2),
      goodsList: goodsList.slice(2)
    });
  },

  onPullDownRefresh() {
    this.setGoodsList();
    wx.stopPullDownRefresh();
  },

  linkTo(e) {
    const { scene, param } = e.currentTarget.dataset;
    switch (scene) {
      case "1":
        wx.navigateTo({
          url: `/pages/common/webview/index?url=${param}`
        });
        break;

      case "2":
        wx.navigateTo({
          url: `/pages/home/subpages/goods-detail/index?id=${param}`
        });
        break;
    }
  }
});
