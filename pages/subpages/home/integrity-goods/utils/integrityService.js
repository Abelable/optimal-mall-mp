import HomeService from "../../utils/homeService";

class IntegrityGoodsService extends HomeService {
  async getRegionOptions() {
    return await this.get({
      url: `${this.baseUrl}/integrity/region_options`,
      loadingTitle: "加载中..."
    });
  }

  async getGoodsList() {
    return await this.get({
      url: `${this.baseUrl}/integrity/goods_list`,
      loadingTitle: "加载中..."
    });
  }
}

export default IntegrityGoodsService;
