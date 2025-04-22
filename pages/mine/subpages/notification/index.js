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

  clear(e) {
    const id = e.detail.id;
    notificationService.clearNotification(id, () => {
      this.init();
    });
  },

  delete(e) {
    const id = e.detail.id;
    notificationService.deleteNotification(id, () => {
      this.init();
    });
  }
});
