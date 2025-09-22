import { WEBVIEW_BASE_URL } from "../../../../config";
import { store } from "../../../../store/index";
import AccountService from "./utils/accountService";

const accountService = new AccountService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    cashInfo: null,
    curMenuIdx: 0,
    dateList: [
      { text: "今日", value: 1 },
      { text: "昨日", value: 2 },
      { text: "本月", value: 3 },
      { text: "上月", value: 4 },
      { text: "全部", value: 0 }
    ],
    curDateIdx: 0,
    timeData: null,
    orderList: [],
    finished: false,
    pointPopupVisible: false,
    authModalVisible: false,
    btnActive: false
  },

  onLoad() {
    const date = new Date().getDate();
    if (date >= 25) {
      this.setData({ btnActive: true });
    }
  },

  onShow() {
    this.init();
  },

  init() {
    this.setCashInfo();
    this.setTimeData();
    this.setOrderList(true);
  },

  async setCashInfo() {
    const cashInfo = await accountService.getCommissionCashInfo();
    this.setData({ cashInfo });
  },

  async setTimeData() {
    const { dateList, curDateIdx, curMenuIdx } = this.data;
    const timeData = await accountService.getCommissionTimeData(
      dateList[curDateIdx].value,
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
    const { curMenuIdx, dateList, curDateIdx, orderList } = this.data;
    const list = await accountService.getCommissionOrderList({
      scene: curMenuIdx + 1,
      timeType: dateList[curDateIdx].value,
      statusList: [1, 2, 3],
      page: ++this.page
    });
    this.setData({ orderList: init ? list : [...orderList, ...list] });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  checkOrderDetail(e) {
    const { id, scene } = e.currentTarget.dataset;
    if (scene === 1) {
      const url = `/pages/mine/subpages/order-center/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  },

  withdraw(e) {
    const { scene } = e.currentTarget.dataset;
    const { btnActive, cashInfo } = this.data;
    const { selfPurchase, share } = cashInfo;

    if (!btnActive) {
      return;
    }
    if (!store.userInfo.authInfoId) {
      this.setData({ authModalVisible: true });
      return;
    }

    const amount = scene === 1 ? selfPurchase : share;
    wx.navigateTo({
      url: `./subpages/withdraw/index?scene=${scene}&amount=${amount}`
    });
  },

  showPointPopup() {
    const { btnActive } = this.data;
    if (!btnActive) {
      return;
    }
    if (!store.userInfo.authInfoId) {
      this.setData({ authModalVisible: true });
      return;
    }
    this.setData({ pointPopupVisible: true });
  },

  exchangeSuccess() {
    this.init();
    this.setData({ pointPopupVisible: false });
  },

  hidePointPopup() {
    this.setData({ pointPopupVisible: false });
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

  hideAuthModal() {
    this.setData({ authModalVisible: false });
  },

  checkWithdrawRecord() {
    wx.navigateTo({
      url: "./subpages/withdraw-record/index"
    });
  },

  checkWithdrawRules() {
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/agreements/withdraw_rules`
    });
  }
});
