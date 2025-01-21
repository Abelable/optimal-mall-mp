import { store } from "../../../../store/index";
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
    const goodsList = (await integrityService.getGoodsList()) || [];
    this.setData({ goodsList });
  },

  onPullDownRefresh() {
    this.setGoodsList();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    const { id } = store.promoterInfo || {};
    const originalPath = `/pages/home/subpages/integrity-goods/index?url=${this.webviewUrl.replace(
      "?",
      "&"
    )}`;
    const path = id ? `${originalPath}&superiorId=${id}` : originalPath;
    return { path };
  }
});
