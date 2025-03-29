import { cleanObject } from "../../../utils/index";
import BaseService from "../../../services/baseService";

class HomeService extends BaseService {
  async getActivityTagOptions() {
    return await this.get({
      url: `${this.baseUrl}/mall/activity_tag_options`
    });
  }

  async getActivityList(tag) {
    return await this.get({
      url: `${this.baseUrl}/mall/activity_list`,
      data: { tag }
    });
  }

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

  async getGoodsEvaluationSummary(goodsId) {
    return await this.get({
      url: `${this.baseUrl}/goods/evaluation/summary`,
      data: { goodsId },
      loadingTitle: "加载中..."
    });
  }

  async getPreOrderInfo(
    deliveryMode,
    cartGoodsIds,
    addressId,
    couponId,
    useBalance = false
  ) {
    return await this.post({
      url: `${this.baseUrl}/order/pre_order_info`,
      data: cleanObject({
        deliveryMode,
        cartGoodsIds,
        addressId,
        couponId,
        useBalance
      })
    });
  }

  async submitOrder({
    deliveryMode,
    addressId = "",
    pickupAddressId = "",
    pickupTime = "",
    pickupMobile = "",
    cartGoodsIds,
    couponId,
    useBalance
  }) {
    return await this.post({
      url: `${this.baseUrl}/order/submit`,
      data: cleanObject({
        deliveryMode,
        addressId,
        pickupAddressId,
        pickupTime,
        pickupMobile,
        cartGoodsIds,
        couponId,
        useBalance
      }),
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

  async getPickupAddressList(cartGoodsId) {
    return await this.get({
      url: `${this.baseUrl}/goods/pickup_address_list`,
      data: { cartGoodsId },
      loadingTitle: "加载中..."
    });
  }
}

export default HomeService;
