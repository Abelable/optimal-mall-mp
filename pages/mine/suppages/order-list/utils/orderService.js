import BaseService from '../../../../../services/baseService'

class OrderService extends BaseService {
  async getOrderList(status, page, limit = 10) {
    const { list = [] } = await this.get({ 
      url: `${this.baseUrl}/order/list`, 
      data: { status, page, limit },
      loadingTitle: '加载中...'
    }) || {}
    return list
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

  async deleteOrder(id, success) {
    await this.post({ 
      url: `${this.baseUrl}/order/delete`, 
      data: { id },
      success
    })
  }

  async getShippingTracker(order_id) {
    return await this.get({ url: `${this.baseUrl}/order/tracker-order-id`, data: { order_id } })
  }

  async publishComment(order_id, comment_type, commentLists, success) {
    return await this.post({ 
      url: `${this.baseUrl}/order/comment`, 
      data: { order_id, comment_type, json_data: JSON.stringify(commentLists) }, 
      success, 
      loadingTitle: '发布中...' 
    })
  }
}

export default OrderService
