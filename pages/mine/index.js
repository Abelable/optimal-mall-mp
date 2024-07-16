import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { checkLogin } from "../../utils/index";
import MineService from "./utils/mineService";

const mineService = new MineService();

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"]
  },

  data: {
    orderStatusList: [
      { en: "pay", zh: "待付款", total: 0 },
      { en: "pack", zh: "待发货", total: 0 },
      { en: "delivery", zh: "待收货", total: 0 },
      { en: "done", zh: "已完成", total: 0 },
      { en: "refund", zh: "退款/售后", total: 0 }
    ]
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
    },

    navToUserInfoSetting() {
      const url = "./subpages/setting/subpages/user-info-setting/index";
      wx.navigateTo({ url });
    }
  }
});
