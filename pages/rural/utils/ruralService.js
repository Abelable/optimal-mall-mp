import BaseService from "../../../services/baseService";

class RuralService extends BaseService {
  async getCartList() {
    return await this.get({
      url: `${this.baseUrl}/cart/list`,
      loadingTitle: "加载中...",
    });
  }
}

export default RuralService;
