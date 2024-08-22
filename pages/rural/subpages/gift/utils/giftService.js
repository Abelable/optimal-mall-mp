import BaseService from "../../../../../services/baseService";

class GiftService extends BaseService {
  async getGoodsList(type) {
    return await this.get({
      url: `${this.baseUrl}/gift/goods_list`,
      data: { type },
      loadingTitle: "加载中..."
    });
  }
}

export default GiftService;
