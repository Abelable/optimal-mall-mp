import { cleanObject } from "../../../utils/index";
import BaseService from "../../../services/baseService";

class HomeService extends BaseService {
  async getShopCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/shop/category_options` });
  }

  async getCategoryOptions(shopCategoryId) {
    return await this.get({
      url: `${this.baseUrl}/goods/category_options`,
      data: { shopCategoryId }
    });
  }

  async getGoodsList({
    categoryId,
    sort,
    order,
    page,
    limit = 10
  }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/goods/list`,
        data: cleanObject({
          categoryId,
          sort,
          order,
          page,
          limit
        }),
        loadingTitle: "加载中..."
      })) || {};
    return list;
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

  async getShopInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/shop/info`,
      data: { id }
    });
  }

  async getShopGoodsList(shopId, page, limit = 10) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/shop/goods_list`,
        data: { shopId, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async getCartList() {
    return await this.get({
      url: `${this.baseUrl}/cart/list`,
      loadingTitle: "加载中..."
    });
  }

  async deleteCartList(ids, success) {
    return await this.post({
      url: `${this.baseUrl}/cart/delete`,
      data: { ids },
      success
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
}

export default HomeService;
