import { store } from "../../../../store/index";
import BaseService from '../../../../services/baseService'

const baseService = new BaseService()

Page({
  data: {
    url: ""
  },

  async onLoad(options) {
    let { url, superiorId = "", ...rest } = options;

    getApp().onLaunched(async () => {
      if (superiorId && !store.promoterInfo) {
        wx.setStorageSync("superiorId", superiorId);
        const superiorInfo = await baseService.getSuperiorInfo(superiorId);
        store.setPromoterInfo(superiorInfo);
      }
    });

    for (let key in rest) {
      if (rest.hasOwnProperty(key) && rest[key])
        url += `${url.indexOf("?") === -1 ? "?" : "&"}${key}=${rest[key]}`;
    }
    this.webviewUrl = url;
  },

  onShow() {
    setTimeout(() => {
      const token = wx.getStorageSync("token") || "";
      if (token) {
        this.setData({
          url: `${this.webviewUrl}${
            this.webviewUrl.indexOf("?") === -1 ? "?" : "&"
          }token=${wx.getStorageSync("token")}`
        });
      } else {
        this.setData({
          url: this.webviewUrl
        });
      }
    });
  },

  onShareAppMessage() {
    const { id } = store.promoterInfo || {};
    const originalPath = `/pages/subpages/common/webview/index?url=${this.webviewUrl.replace(
      "?",
      "&"
    )}`;
    const path = id ? `${originalPath}&superiorId=${id}` : originalPath;
    return { path };
  }
});
