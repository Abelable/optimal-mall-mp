import AccountService from "./utils/accountService";

const accountService = new AccountService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    cashInfo: null,
    curMenuIdx: 0,
    dateList: ["今日", "昨日", "本月", "上月", "全部"],
    curDateIdx: 0,
    timeData: 0,
    orderList: [],
    finished: false
  },

  onLoad() {
    this.setCashInfo();
    this.setTimeData();
    this.setOrderList(true);
  },

  async setCashInfo() {
    const cashInfo = await accountService.getCommissionCashInfo();
    this.setData({ cashInfo });
  },

  async setTimeData() {
    const { curDateIdx, curMenuIdx } = this.data;
    const timeData = await accountService.getCommissionTimeData(
      curDateIdx + 1,
      curMenuIdx + 1
    );
    this.setData({ timeData });
  },

  selectMenu(e) {
    const curMenuIdx = e.currentTarget.dataset.index;
    this.setData({ curMenuIdx });
    this.setTimeData();
    this.setOrderList(true);
  },

  selectDate(e) {
    const curDateIdx = e.currentTarget.dataset.index;
    this.setData({ curDateIdx });
    this.setTimeData();
    this.setOrderList(true);
  },

  async setOrderList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    const { curMenuIdx, curDateIdx, orderList } = this.data;
    const list = await accountService.getCommissionOrderList(
      curMenuIdx + 1,
      curDateIdx + 1,
      ++this.page
    );
    this.setData({ orderList: init ? list : [...list, ...orderList] });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  checkOrderDetail(e) {
    const { orderSn } = e.currentTarget.dataset;
    const url = `/pages/mine/subpages/order-center/subpages/order-detail/index?orderSn=${orderSn}`;
    wx.navigateTo({ url });
  },

  withdraw() {
    wx.navigateTo({
      url: "./subpages/withdraw/index"
    });
  },

  onReachBottom() {
    this.setOrderList();
  },

  onPullDownRefresh() {
    this.setOrderList(true);
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
      url: "./subpages/withdraw-record/index"
    });
  }
});
