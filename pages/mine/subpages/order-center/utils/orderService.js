import MineService from "../../../utils/mineService";

class OrderService extends MineService {
  async getOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/order/list`,
        data: { status, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async getOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
    });
  }

  async confirmOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/order/confirm`,
      data: { id },
      success
    });
  }

  async cancelOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/order/cancel`,
      data: { id },
      success
    });
  }

  async refundOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/order/refund`,
      data: { id },
      success
    });
  }

  async deleteOrder(ids, success) {
    await this.post({
      url: `${this.baseUrl}/order/delete`,
      data: { ids },
      success
    });
  }

  async getShippingInfo(shipCode, shipSn, mobile) {
    return await this.get({
      url: `${this.baseUrl}/shipping_info`,
      data: { shipCode, shipSn, mobile }
    });
  }

  async submitEvaluation(
    status,
    orderId,
    goodsIds,
    score,
    content,
    imageList,
    success
  ) {
    return await this.post({
      url: `${this.baseUrl}/goods/evaluation/${status === 501 ? 'edit' : 'add'}`,
      data: { orderId, goodsIds, score, content, imageList },
      success
    });
  }

  async getEvaluation(orderId) {
    return await this.get({
      url: `${this.baseUrl}/goods/evaluation/detail`,
      data: { orderId },
      loadingTitle: "加载中..."
    });
  }

  async getRefundAmount(orderId, goodsId, couponId) {
    return await this.get({
      url: `${this.baseUrl}/refund/amount`,
      data: { orderId, goodsId, couponId }
    });
  }

  async getRefund(orderId, goodsId) {
    return await this.get({
      url: `${this.baseUrl}/refund/detail`,
      data: { orderId, goodsId }
    });
  }

  async addRefund(
    orderId,
    orderSn,
    goodsId,
    couponId,
    type,
    reason,
    imageList,
    success
  ) {
    await this.post({
      url: `${this.baseUrl}/refund/add`,
      data: { orderId, orderSn, goodsId, couponId, type, reason, imageList },
      success
    });
  }

  async editRefund(id, type, reason, imageList, success) {
    await this.post({
      url: `${this.baseUrl}/refund/edit`,
      data: { id, type, reason, imageList },
      success
    });
  }

  async submitShipInfo(id, shipCode, shipSn, success) {
    await this.post({
      url: `${this.baseUrl}/refund/submit_shipping_info`,
      data: { id, shipCode, shipSn },
      success
    });
  }

  async getWaybillToken(id) {
    return await this.get({
      url: `${this.baseUrl}/order/waybill_token`,
      data: { id }
    });
  }

  async modifyOrderAddressInfo(orderId, addressId) {
    return await this.post({
      url: `${this.baseUrl}/order/modify_address_info`,
      data: { orderId, addressId }
    });
  }

  async getVerifyCode(orderId) {
    return await this.get({
      url: `${this.baseUrl}/order/verify_code`,
      data: { orderId }
    });
  }

  async getHistoryKeywords() {
    return await this.get({
      url: `${this.baseUrl}/order/keyword/list`,
      loadingTitle: "加载中..."
    });
  }

  async saveKeywords(keywords) {
    return await this.post({
      url: `${this.baseUrl}/order/keyword/add`,
      data: { keywords }
    });
  }

  async clearHistoryKeywords() {
    return await this.post({
      url: `${this.baseUrl}/order/keyword/clear`
    });
  }

  async searchOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/order/search`,
      data: { keywords },
      loadingTitle: "加载中..."
    });
  }
}

export default OrderService;
