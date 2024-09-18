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
    fields: ["userInfo", "promoterInfo"]
  },

  data: {
    statusBarHeight,
    navBarBgVisible: false,
    dateList: ["今日", "昨日", "本月", "上月"],
    curDateIdx: 0,
    commissionSumInfo: null,
    commissionTimeData: null,
    customerData: {},
    orderStatusList: [
      { en: "pay", zh: "待付款", total: 0 },
      { en: "pack", zh: "待发货", total: 0 },
      { en: "delivery", zh: "待收货", total: 0 },
      { en: "done", zh: "待评价", total: 0 },
      { en: "refund", zh: "售后", total: 0 }
    ],
    authInfoModalVisible: false
  },

  pageLifetimes: {
    show() {
      checkLogin(async () => {
        await mineService.getUserInfo();
        if (store.promoterInfo) {
          this.setCommissionSumInfo();
          this.setCommissionTimeData();
          this.setCustomerData();
        }
        this.setOrderListTotals();
      });
    }
  },

  methods: {
    async setCommissionSumInfo() {
      const commissionSumInfo = await mineService.getCommissionSumInfo();
      this.setData({ commissionSumInfo });
    },

    async setCommissionTimeData() {
      const commissionTimeData = await mineService.getCommissionTimeData(
        this.data.curDateIdx + 1
      );
      this.setData({ commissionTimeData });
    },

    async setCustomerData() {
      const customerData = await mineService.getCustomerData();
      this.setData({ customerData });
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
      this.setCommissionTimeData();
    },

    withdraw() {
      wx.navigateTo({
        url: "./subpages/account/index"
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

    navToNotification() {
      wx.navigateTo({
        url: "./subpages/notification/index"
      });
    },

    navToCoupon() {
      wx.navigateTo({
        url: "./subpages/coupon-list/index"
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
    },

    // 分享
    onShareAppMessage() {
      if (store.promoterInfo) {
        const { id, nickname, signature } = store.promoterInfo;
        const title = `${nickname} ${signature || "好物尽在诚信星球"}`;
        const path = `/pages/home/index?superiorId=${id}`;
        const imageUrl =
          "https://static.youbozhenxuan.cn/mp/home_share_cover.png";
        return { title, imageUrl, path };
      }
    }
  }
});
