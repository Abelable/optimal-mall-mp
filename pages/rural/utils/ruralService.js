import BaseService from "../../../services/baseService";

class RuralService extends BaseService {
  async getBannerList() {
    return await this.get({
      url: `${this.baseUrl}/rural/banner_list`,
      loadingTitle: "加载中..."
    });
  }

  async getRegionOptions() {
    return await this.get({
      url: `${this.baseUrl}/rural/region_options`,
      loadingTitle: "加载中..."
    });
  }

  async getGoodsList(regionId) {
    return await this.get({
      url: `${this.baseUrl}/rural/goods_list`,
      data: { regionId },
      loadingTitle: "加载中..."
    });
  }
}

export default RuralService;
