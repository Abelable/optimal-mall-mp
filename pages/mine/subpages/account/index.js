const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    withdrawAmount: undefined,
    commission: 0,
    curMenuIdx: 0,
    dateList: ["今日", "昨日", "本月", "上月", "全部"],
    curDateIdx: 0,
    recordList: [
      {
        orderInfo: {
          orderSn: "77667889900998777778",
          status: "待结算",
          time: "2024.07.09",
          commission: "14.50"
        },
        goodsInfo: {
          cover:
            "https://static.youbozhenxuan.cn/img/20240802/1722591702333主图_1.jpg",
          name: "黄花黄花黄花黄花黄花黄花",
          spec: "商品规格商品规格商品规格商品规格",
          commission: "14.50"
        }
      }
    ],
    finished: false
  },

  selectMenu(e) {
    const curMenuIdx = e.currentTarget.dataset.index;
    this.setData({ curMenuIdx });
  },

  selectDate(e) {
    const curDateIdx = e.currentTarget.dataset.index;
    this.setData({ curDateIdx });
  },

  checkOrderDetail(e) {
    const { orderSn } = e.currentTarget.dataset;
    const url = `/pages/mine/subpages/order-center/subpages/order-detail/index?orderSn=${orderSn}`;
    wx.navigateTo({ url });
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
  },

  checkWithdrawRecord() {
    wx.navigateTo({
      url: './subpages/withdraw-record/index'
    });
  }
});
