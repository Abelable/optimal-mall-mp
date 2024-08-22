import BaseService from "../../../services/baseService";

class MineService extends BaseService {
  async getOrderTotals() {
    return await this.get({
      url: `${this.baseUrl}/order/totals`
    });
  }
}

export default MineService;
