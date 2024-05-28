import { WEBVIEW_BASE_URL } from "../../../config";
import BaseService from "../../../services/baseService";

const baseService = new BaseService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    agree: false,
    authModalVisible: false,
    avatarUrl: "https://img.ubo.vip/youmeng/default_avatar.png"
  },

  async getMobile(e) {
    const mobile = await baseService.getUserMobile(e.detail.code);
    if (mobile) {
      this.mobile = mobile;
      this.setData({ authModalVisible: true });
    }
  },

  async onChooseAvatar(e) {
    const avatarUrl = (await baseService.uploadFile(e.detail.avatarUrl)) || "";
    this.setData({ avatarUrl });
  },

  setNickname(e) {
    this.nickname = e.detail.value;
  },

  async saveAuthInfo() {
    if (!this.nickname) {
      wx.showToast({
        title: "请输入用户昵称",
        icon: "none"
      });
      return;
    }
    await this.register();
    this.back();
  },

  async register() {
    const { code } = await baseService.wxLogin();
    const token = await baseService.register(
      code,
      this.data.avatarUrl,
      this.nickname,
      this.mobile
    );
    if (token) {
      wx.setStorageSync("token", token);
      wx.navigateBack();
    }
  },

  toggleAgree() {
    this.setData({
      agree: !this.data.agree,
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
      title: "请先阅读并同意有播甄选用户服务协议",
      icon: "none"
    });
  },

  back() {
    wx.navigateBack();
  }
});
