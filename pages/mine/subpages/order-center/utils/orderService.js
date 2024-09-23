import MineService from '../../../utils/mineService'

class OrderService extends MineService {
  async getOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/order/list`,
        data: { status, page, limit },
        loadingTitle: "加载中...",
      })) || {};
    return list;
  }

  async getOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/order/detail`,
      data: { id },
      loadingTitle: '加载中...'
    })
  }

  async confirmOrder(id, success) {
    await this.post({ 
      url: `${this.baseUrl}/order/confirm`, 
      data: { id },
      success
    })
  }

  async cancelOrder(id, success) {
    await this.post({ 
      url: `${this.baseUrl}/order/cancel`, 
      data: { id },
      success
    })
  }

  async refundOrder(id, success) {
    await this.post({ 
      url: `${this.baseUrl}/order/refund`, 
      data: { id },
      success
    })
  }

  async deleteOrder(ids, success) {
    await this.post({ 
      url: `${this.baseUrl}/order/delete`, 
      data: { ids },
      success
    })
  }

  async getShippingInfo(orderId) {
    return await this.get({ url: `${this.baseUrl}/order/shipping_info`, data: { orderId } })
  }

  async submitEvaluation(orderId, goodsIds, score, content, imageList, success) {
    return await this.post({ 
      url: `${this.baseUrl}/goods/evaluation/add`, 
      data: { orderId, goodsIds, score, content, imageList }, 
      success, 
    })
  }
}

export default OrderService
