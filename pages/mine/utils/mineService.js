import BaseService from "../../../services/baseService";
import { cleanObject } from "../../../utils/index";

class MineService extends BaseService {
  async getOrderTotals() {
    return await this.get({
      url: `${this.baseUrl}/order/totals`
    });
  }

  async updateUserInfo(userInfo, success) {
    return await this.post({ 
      url: `${this.baseUrl}/user/update`, 
      data: cleanObject(userInfo),
      success
    })
  }
}

export default MineService;
