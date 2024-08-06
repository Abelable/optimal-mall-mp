const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    withdrawAmount: undefined,
    commission: 0,
    recordList: [
      {
        status: 2,
        amount: "420.00",
        commission: "180",
        time: "2021-03-10 14:33:48"
      },
      {
        status: 1,
        amount: "420.00",
        commission: "180",
        time: "2021-03-10 14:33:48"
      },
      {
        status: 0,
        amount: "420.00",
        commission: "180",
        time: "2021-03-10 14:33:48"
      }
    ]
  },

  setWithdrawAmount(e) {
    const withdrawAmount = e.detail.value;
    const commission = withdrawAmount * 0.001;
    this.setData({ withdrawAmount, commission });
  },

  withdraw() {},

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
