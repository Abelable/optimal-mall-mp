import BaseService from "../../../../../../../services/baseService";

class OrderService extends BaseService {
  async getOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/hotel/order/list`,
        data: { status, page, limit },
        loadingTitle: "加载中...",
      })) || {};
    return list;
  }

  async getOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/hotel/order/detail`,
      data: { id },
      loadingTitle: "加载中...",
    });
  }

  async confirmOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/order/confirm`,
      data: { id },
      success,
    });
  }

  async cancelOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/order/cancel`,
      data: { id },
      success,
    });
  }

  async refundOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/order/refund`,
      data: { id },
      success,
    });
  }

  async deleteOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/order/delete`,
      data: { id },
      success,
    });
  }

  async publishComment(order_id, comment_type, commentLists, success) {
    return await this.post({
      url: `${this.baseUrl}/hotel/order/comment`,
      data: { order_id, comment_type, json_data: JSON.stringify(commentLists) },
      success,
      loadingTitle: "发布中...",
    });
  }
}

export default OrderService;