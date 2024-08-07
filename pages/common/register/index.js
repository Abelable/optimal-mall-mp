import { WEBVIEW_BASE_URL } from "../../../config";
import BaseService from "../../../services/baseService";

const baseService = new BaseService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    agree: false,
    authModalVisible: false,
    avatarUrl: ""
  },

  async getMobile(e) {
    const mobile = await baseService.getUserMobile(e.detail.code);
    if (mobile) {
      this.mobile = mobile;
      this.setData({ authModalVisible: true });
    }
  },

  async chooseAvatar(e) {
    const avatarUrl = (await baseService.uploadFile(e.detail.avatarUrl)) || "";
    this.setData({ avatarUrl });
  },

  setNickname(e) {
    this.nickname = e.detail.value;
  },

  saveAuthInfo() {
    if (!this.data.avatarUrl) {
      wx.showToast({
        title: "请上传用户头像",
        icon: "none"
      });
      return;
    }
    if (!this.nickname) {
      wx.showToast({
        title: "请输入用户昵称",
        icon: "none"
      });
      return;
    }
    this.register();
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
      title: "请先阅读并同意诚信星球用户服务协议",
      icon: "none"
    });
  },

  back() {
    wx.navigateBack();
  }
});
