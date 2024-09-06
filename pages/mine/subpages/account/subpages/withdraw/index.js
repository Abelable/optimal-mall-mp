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

  withdraw() {
    wx.navigateTo({
      url: "/pages/mine/subpages/account/subpages/withdraw-result/index"
    });
  }
});
