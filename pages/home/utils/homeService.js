import { cleanObject } from "../../../utils/index";
import BaseService from "../../../services/baseService";

class HomeService extends BaseService {
  async getBannerList() {
    return await this.get({
      url: `${this.baseUrl}/mall/banner_list`,
      loadingTitle: "加载中..."
    });
  }

  async getActivityList(tag) {
    return await this.get({
      url: `${this.baseUrl}/mall/activity_list`,
      data: { tag },
      loadingTitle: "加载中..."
    });
  }

  async getGoodsInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/goods/detail`,
      data: { id },
      loadingTitle: "加载中..."
    });
  }

  async getGoodsEvaluationSummary(goodsId) {
    return await this.get({
      url: `${this.baseUrl}/goods/evaluation/summary`,
      data: { goodsId },
      loadingTitle: "加载中..."
    });
  }

  async getPreOrderInfo(cartGoodsIds, addressId) {
    return await this.post({
      url: `${this.baseUrl}/order/pre_order_info`,
      data: cleanObject({ cartGoodsIds, addressId })
    });
  }

  async submitOrder(cartGoodsIds, addressId) {
    return await this.post({
      url: `${this.baseUrl}/order/submit`,
      data: { addressId, cartGoodsIds },
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
