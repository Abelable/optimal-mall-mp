import MineService from "../../../utils/mineService";

class NotificationService extends MineService {
  async getNotificationList() {
    return await this.get({
      url: `${this.baseUrl}/notification/list`,
      loadingTitle: "加载中..."
    });
  }

  async clearAllNotifications(success) {
    return await this.post({
      url: `${this.baseUrl}/notification/clear_all`,
      success
    });
  }

  async clearNotification(id, success) {
    return await this.post({
      url: `${this.baseUrl}/notification/clear`,
      data: { id },
      success
    });
  }

  async deleteNotification(id, success) {
    return await this.post({
      url: `${this.baseUrl}/notification/delete`,
      data: { id },
      success
    });
  }
}

export default NotificationService;
