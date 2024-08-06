const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    withdrawAmount: undefined,
    commission: 0
  },

  setWithdrawAmount(e) {
    const withdrawAmount = e.detail.value;
    const commission = withdrawAmount * 0.001;
    this.setData({ withdrawAmount, commission });
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
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
  }
});
