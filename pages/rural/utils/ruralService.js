import BaseService from "../../../services/baseService";

class RuralService extends BaseService {
  async getPromoterList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/promoter/list`,
      data: { page, limit }
    });
  }
}

export default RuralService;
