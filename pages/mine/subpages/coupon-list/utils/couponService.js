import BaseService from "../../../../../services/baseService";

class CouponService extends BaseService {
  async getCouponList(status) {
    return await this.get({
      url: `${this.baseUrl}/coupon/user_list`,
      data: { status },
      loadingTitle: "加载中..."
    });
  }
}

export default CouponService;
