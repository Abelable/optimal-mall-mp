import { cleanObject } from "../../../utils/index";
import BaseService from "../../../services/baseService";

class HomeService extends BaseService {
  async getBannerList() {
    return await this.get({
      url: `${this.baseUrl}/mall/banner_list`
    });
  }

  async getActivityList(tag) {
    return await this.get({
      url: `${this.baseUrl}/mall/activity_list`,
      data: { tag }
    });
  }

  async getGoodsEvaluationSummary(goodsId) {
    return await this.get({
      url: `${this.baseUrl}/goods/evaluation/summary`,
      data: { goodsId },
      loadingTitle: "加载中..."
    });
  }

  async getPreOrderInfo(cartGoodsIds, addressId, couponId) {
    return await this.post({
      url: `${this.baseUrl}/order/pre_order_info`,
      data: cleanObject({ cartGoodsIds, addressId, couponId })
    });
  }

  async submitOrder(cartGoodsIds, addressId, couponId) {
    return await this.post({
      url: `${this.baseUrl}/order/submit`,
      data: cleanObject({ addressId, cartGoodsIds, couponId }),
      loadingTitle: "订单提交中..."
    });
  }

  async getGoodsEvaluationList(goodsId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/goods/evaluation/list`,
      data: { goodsId, page, limit },
      loadingTitle: "加载中..."
    });
  }

  async receiveCoupon(id, success) {
    return await this.post({
      url: `${this.baseUrl}/coupon/receive`,
      data: { id },
      success
    });
  }
}

export default HomeService;
