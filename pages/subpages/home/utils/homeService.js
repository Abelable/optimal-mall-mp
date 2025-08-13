import BaseService from "../../../../services/baseService";

class HomeService extends BaseService {
  async getGrainGoodsList() {
    return await this.get({
      url: `${this.baseUrl}/mall/grain_goods_list`,
      loadingTitle: "加载中..."
    });
  }

  async getFreshGoodsList() {
    return await this.get({
      url: `${this.baseUrl}/mall/fresh_goods_list`,
      loadingTitle: "加载中..."
    });
  }

  async getSnackGoodsList() {
    return await this.get({
      url: `${this.baseUrl}/mall/snack_goods_list`,
      loadingTitle: "加载中..."
    });
  }

  async getGiftGoodsList() {
    return await this.get({
      url: `${this.baseUrl}/mall/gift_goods_list`,
      loadingTitle: "加载中..."
    });
  }
}

export default HomeService;
