import BaseService from "../../../services/baseService";
import { cleanObject } from "../../../utils/index";

class MineService extends BaseService {
  async getCommissionSumInfo() {
    return await this.get({
      url: `${this.baseUrl}/commission/sum`
    });
  }

  async getCommissionTimeData(timeType, scene) {
    return await this.get({
      url: `${this.baseUrl}/commission/time_data`,
      data: cleanObject({ timeType, scene })
    });
  }

  async getCustomerData() {
    return await this.get({
      url: `${this.baseUrl}/user/customer_data`
    });
  }

  async getOrderTotals() {
    return await this.get({
      url: `${this.baseUrl}/order/totals`
    });
  }

  async getTodayNewCustomerList() {
    return await this.get({
      url: `${this.baseUrl}/user/today_new_customer_list`
    });
  }

  async getTodayOrderingCustomerList() {
    return await this.get({
      url: `${this.baseUrl}/user/today_ordering_customer_list`
    });
  }

  async getCustomerList({ keywords, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/user/customer_list`,
        data: cleanObject({ keywords, page, limit }),
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async verify(code, success) {
    return await this.post({
      url: `${this.baseUrl}/order/verify`,
      data: { code },
      success
    });
  }

  async getUnreadNotificationCount() {
    return await this.get({
      url: `${this.baseUrl}/notification/unread_count`
    });
  }
}

export default MineService;
