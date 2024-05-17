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

    navToSetting() {
      wx.navigateTo({
        url: "/pages/mine/setting/index"
      });
    },

    navToUserInfoSetting() {
      const url = "/pages/mine/subpages/setting/subpages/user-info-setting/index";
      wx.navigateTo({ url });
    }
  }
});
