import BaseService from "../../../services/baseService";

class MineService extends BaseService {
  async getUserCollectMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/collect_list`,
      data: { page, limit },
      loadingTitle: "加载中...",
    });
  }

  async getUserLikeMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/like_list`,
      data: { page, limit },
      loadingTitle: "加载中...",
    });
  }
}

export default MineService;
