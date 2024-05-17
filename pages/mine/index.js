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
      { en: "pay", zh: "待付款" },
      { en: "pack", zh: "待发货" },
      { en: "delivery", zh: "待收货" },
      { en: "done", zh: "已完成" },
      { en: "refund", zh: "退款/售后" }
    ]
  },

  lifetimes: {
    attached() {}
  },

  pageLifetimes: {
    show() {
      checkLogin(() => {
        this.updateUserInfo();
      });
    }
  },

  methods: {
    updateUserInfo() {
      mineService.getUserInfo();
    },

    navToOrderCenter(e) {
      const { status } = e.currentTarget.dataset
      wx.navigateTo({
        url: `./subpages/order-center/index?status=${status}`
      });
    },

    navToAddress() {
      wx.navigateTo({
        url: './subpages/address-list/index'
      });
    },

    navToWallet() {
      wx.navigateTo({
        url: './subpages/wallet/index'
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
