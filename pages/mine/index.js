import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { checkLogin } from "../../utils/index";
import MineService from "./utils/mineService";

const mineService = new MineService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo", "teamLeaderInfo"]
  },

  data: {
    statusBarHeight,
    navBarBgVisible: false,
    level: 0,
    dateList: ["今日", "昨日", "本月", "上月"],
    curDateIdx: 0,
    orderStatusList: [
      { en: "pay", zh: "待付款", total: 0 },
      { en: "pack", zh: "待发货", total: 0 },
      { en: "delivery", zh: "待收货", total: 0 },
      { en: "done", zh: "待评价", total: 0 },
      { en: "refund", zh: "售后", total: 0 }
    ],
    authInfoModalVisible: false
  },

  observers: {
    teamLeaderInfo: function (info) {
      if (info) {
        this.setData({ level: 1 });
      }
    }
  },

  pageLifetimes: {
    show() {
      checkLogin(() => {
        this.updateUserInfo();
        this.setOrderListTotals();
      });
    }
  },

  methods: {
    updateUserInfo() {
      mineService.getUserInfo();
    },

    async setOrderListTotals() {
      const orderTotals = await mineService.getOrderTotals();
      const { orderStatusList } = this.data;
      orderStatusList[0].total = orderTotals[0];
      orderStatusList[1].total = orderTotals[1];
      orderStatusList[2].total = orderTotals[2];
      orderStatusList[4].total = orderTotals[3];
      this.setData({ orderStatusList });
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
    },

    showAuthInfoModal() {
      this.setData({ authInfoModalVisible: true });
    },

    hideAuthInfoModal() {
      this.setData({ authInfoModalVisible: false });
    },

    selectDate(e) {
      const curDateIdx = e.currentTarget.dataset.index;
      this.setData({ curDateIdx });
    },

    withdraw() {
      wx.navigateTo({
        url: "./subpages/account/index"
      });
    },

    checkSalesData() {
      wx.navigateTo({
        url: "./subpages/sales-data/index"
      });
    },

    navToIntegritySchool() {},

    navToOrderCenter(e) {
      const { status } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `./subpages/order-center/index?status=${status}`
      });
    },

    navToAddress() {
      wx.navigateTo({
        url: "./subpages/address-list/index"
      });
    },

    navToWallet() {
      wx.navigateTo({
        url: "./subpages/wallet/index"
      });
    },

    navToSetting() {
      wx.navigateTo({
        url: "./subpages/setting/index"
      });
    }
  }
});
