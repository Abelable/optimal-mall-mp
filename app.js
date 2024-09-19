import BaseService from "./services/baseService";
import { store } from "./store/index";

const baseService = new BaseService();

App({
  globalData: {
    systemInfo: null,
    liveCustomMsg: null,
    launched: false
  },

  async onLaunch() {
    this.setSystemInfo();

    if (!wx.getStorageSync("token")) {
      await baseService.login();
    }

    if (wx.getStorageSync("token")) {
      const userInfo = await baseService.getUserInfo();
      if (userInfo.level) {
        store.setPromoterInfo(userInfo);
      } else if (userInfo.superiorId) {
        const superiorInfo = await baseService.getSuperiorInfo(
          userInfo.superiorId
        );
        store.setPromoterInfo(superiorInfo);
      }
    } else {
      const superiorId = wx.getStorageSync("superiorId");
      if (superiorId) {
        const superiorInfo = await baseService.getSuperiorInfo(superiorId);
        store.setPromoterInfo(superiorInfo);
      }
    }

    this.globalData.launched = true;
  },

  onLaunched(handler) {
    Object.defineProperty(this.globalData, "launched", {
      configurable: true,
      enumerable: true,
      set: value => {
        this.value = value;
        handler(value);
      },
      get: () => {
        return this.value;
      }
    });
  },

  onShow() {
    this.update();
  },

  setSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
  },

  update() {
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success: res => {
                res.confirm && updateManager.applyUpdate();
              }
            });
          });
          updateManager.onUpdateFailed(() => {
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            });
          });
        }
      });
    } else {
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    }
  }
});
