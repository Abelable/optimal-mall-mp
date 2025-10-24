import { store } from "../../../../store/index";
import HomeService from "../utils/homeService";

const homeService = new HomeService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false,
    themeInfo: null,
    topGoodsList: [],
    goodsList: []
  },

  onLoad({ id }) {
    this.themeId = id;
    this.setThemeInfo();
    this.setGoodsList();
  },

  async setThemeInfo() {
    const themeInfo = (await homeService.getThemeZoneInfo(this.themeId)) || {};
    this.setData({ themeInfo });
  },

  async setGoodsList() {
    const goodsList =
      (await homeService.getThemeZoneGoodsList(this.themeId)) || [];
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
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.headerVisible) {
        this.setData({ headerVisible: true });
      }
    } else {
      if (this.data.headerVisible) {
        this.setData({ headerVisible: false });
      }
    }
  },

  onShareAppMessage() {
    const { id } = store.promoterInfo || {};
    const originalPath = `/pages/subpages/home/theme-zone/index?id=${this.themeId}`;
    const path = id ? `${originalPath}&superiorId=${id}` : originalPath;
    return { path, title: this.data.themeInfo.name };
  }
});
