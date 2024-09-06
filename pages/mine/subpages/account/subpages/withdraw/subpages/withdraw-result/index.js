const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight
  },

  navigateBack() {
    wx.navigateBack({ delta: 2 });
  },

  checkRecord() {
    wx.navigateTo({
      url: "/pages/mine/subpages/account/subpages/withdraw-record/index"
    });
  }
});
