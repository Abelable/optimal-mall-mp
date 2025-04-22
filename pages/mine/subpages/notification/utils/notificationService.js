import MineService from "../../../utils/mineService";

class NotificationService extends MineService {
  async getNotificationList() {
    return await this.get({
      url: `${this.baseUrl}/notification/list`,
      loadingTitle: "加载中..."
    });
  }

  async clearAllNotifications() {
    return await this.post({
      url: `${this.baseUrl}/notification/clear_all`
    });
  }

  async clearNotification(id) {
    return await this.post({
      url: `${this.baseUrl}/notification/clear`,
      data: { id }
    });
  }

  async deleteNotification(id) {
    return await this.post({
      url: `${this.baseUrl}/notification/delete`,
      data: { id }
    });
  }
}

export default NotificationService;
