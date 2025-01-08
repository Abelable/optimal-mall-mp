import { WEBVIEW_BASE_URL } from "../../../config";
import BaseService from "../../../services/baseService";

const baseService = new BaseService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    agree: false
  },

  onLoad() {
    this.superiorId = wx.getStorageSync("superiorId") || "";
  },

  async getMobile(e) {
    const mobile = await baseService.getUserMobile(e.detail.code);
    if (mobile) {
      this.mobile = mobile;
      this.register();
    }
  },

  async register() {
    const { code } = await baseService.wxLogin();
    const token = await baseService.register(
      code,
      this.mobile,
      this.superiorId
    );
    if (token) {
      wx.setStorageSync("token", token);
      if (this.superiorId) {
        wx.removeStorageSync("superiorId");
      }
      wx.navigateBack();
    }
  },

  toggleAgree() {
    this.setData({
      agree: !this.data.agree
    });
  },

  serviceAgreement() {
    wx.navigateTo({
      url: `/pages/common/webview/index?url=${WEBVIEW_BASE_URL}/agreements/user_service`
    });
  },

  navToHome() {
    wx.switchTab({ url: "/pages/tab-bar-pages/home/index" });
  },

  toast() {
    wx.showToast({
      title: "请先阅读并同意诚信星球用户服务协议",
      icon: "none"
    });
  },

  back() {
    const pagesLength = getCurrentPages().length;
    const prePage = getCurrentPages()[pagesLength - 2];
    const prePageRoute = prePage ? prePage.route : "";
    console.log("prePageRoute", prePageRoute);
    if (
      prePageRoute === "pages/mine/index" ||
      prePageRoute === "pages/cart/index"
    ) {
      wx.switchTab({ url: "/pages/home/index" });
    } else if (prePageRoute === "pages/home/subpages/cart/index") {
      wx.navigateBack({ delta: 2 });
    } else {
      wx.navigateBack();
    }
  }
});
