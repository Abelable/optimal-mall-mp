import { WEBVIEW_BASE_URL } from "../../../../../../config";

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    curOptionIdx: 0
  },

  selectOption(e) {
    const curOptionIdx = e.currentTarget.dataset.index;
    this.setData({ curOptionIdx });
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: true });
      }
    } else {
      if (this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: false });
      }
    }
  },

  bindBank() {
    wx.navigateTo({
      url: "./subpages/bind-bank/index"
    });
  },

  withdraw() {
    const url = `/pages/common/webview/index?url=${WEBVIEW_BASE_URL}/auth`;
    wx.navigateTo({ url });
    // wx.navigateTo({
    //   url: "./subpages/withdraw-result/index"
    // });
  }
});
