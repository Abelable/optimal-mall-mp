import MineService from "../../../utils/mineService";
class CouponService extends MineService {
  async getCouponList(status, page, limit = 10) {
    const { list = [] } = await this.get({
      url: `${this.baseUrl}/coupon/user_list`,
      data: { status, page, limit },
      loadingTitle: "加载中..."
    });
    return list;
  }
}

export default CouponService;
