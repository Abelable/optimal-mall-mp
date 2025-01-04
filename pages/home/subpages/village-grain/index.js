import HomeService from "../../utils/homeService";

const homeService = new HomeService();

Page({
  data: {
    topGoodsList: [],
    goodsList: []
  },

  async onLoad() {
    this.setGoodsList();
  },

  async setGoodsList() {
    const goodsList = (await homeService.getGrainGoodsList()) || [];
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
