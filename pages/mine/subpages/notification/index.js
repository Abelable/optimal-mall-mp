import { WEBVIEW_BASE_URL } from "../../../../config";
import NotificationService from "./utils/notificationService";

const notificationService = new NotificationService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    unreadNotificationCount: 0,
    notificationList: []
  },

  onShow() {
    this.init();
  },

  init() {
    this.setUnreadNotificationCount();
    this.setNotificationList();
  },

  async setUnreadNotificationCount() {
    const unreadNotificationCount =
      await notificationService.getUnreadNotificationCount();
    this.setData({ unreadNotificationCount });
  },

  async setNotificationList() {
    const list = await notificationService.getNotificationList();
    const notificationList = list.map(item => {
      let icon = "";
      switch (item.type) {
        case 1:
          icon = "logistics";
          break;
        case 2:
        case 3:
        case 5:
          icon = "deposit";
          break;
        case 4:
          icon = "business";
          break;
      }
      return { ...item, icon };
    });
    this.setData({ notificationList });
  },

  clearAll() {
    notificationService.clearAllNotifications(() => {
      this.init();
    });
  },

  clear(id) {
    notificationService.clearNotification(id, () => {
      this.init();
    });
  },

  delete(e) {
    const { id } = e.currentTarget.dataset;
    const { position, instance } = e.detail;
    if (position === "right") {
      notificationService.deleteNotification(id, () => {
        this.init();
        instance.close();
      });
    }
  },

  check(e) {
    const { id, type, referenceId } = e.currentTarget.dataset.info;
    switch (type) {
      case 1:
      case 2:
        wx.navigateTo({
          url: `/pages/mine/subpages/order-center/subpages/order-detail/index?id=${referenceId}`
        });
        break;

      case 3:
        wx.navigateTo({
          url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/auth`
        });
        break;

      case 4:
        wx.navigateTo({
          url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/team/certification`
        });
        break;

      case 5:
        wx.navigateTo({
          url: "/pages/mine/subpages/account/subpages/withdraw-record/index"
        });
        break;
    }

    this.clear(id);
  }
});
