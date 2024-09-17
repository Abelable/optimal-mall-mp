import BaseService from "../../../services/baseService";

class MineService extends BaseService {
  async getCommissionSumInfo() {
    return await this.get({
      url: `${this.baseUrl}/commission/sum`
    });
  }

  async getCommissionTimeData(timeType) {
    return await this.get({
      url: `${this.baseUrl}/commission/time_data`,
      data: { timeType }
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
}

export default MineService;
