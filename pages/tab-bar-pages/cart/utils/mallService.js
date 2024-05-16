import BaseService from "../../../../services/baseService";

class MallService extends BaseService {
  async getBannerList() {
    return await this.get({
      url: `${this.baseUrl}/mall/banner_list`,
      loadingTitle: "加载中...",
    });
  }
  
  async getCommodityList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/mall/commodity_list`,
      data: { page, limit },
      loadingTitle: '加载中...'
    });
  }
}

export default MallService;
