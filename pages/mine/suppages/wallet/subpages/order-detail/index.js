import ShopService from '../../utils/shopService'

const shopService = new ShopService()

Page({
  data: {
    orderInfo: null
  },
  
  onLoad({ id }) {
    this.orderId = id
    this.setOrderInfo()
  },

  async setOrderInfo() {
    const orderInfo = await shopService.getOrderDetail(this.orderId)
    this.setData({ orderInfo })

    const titleEnums = {
      101: '等待买家付款',
      102: '交易关闭',
      103: '交易关闭',
      104: '交易关闭',
      201: '等待卖家发货',
      202: '退款申请中',
      203: '退款成功',
      301: '待收货',
      401: '交易成功',
      402: '交易成功',
    }
    wx.setNavigationBarTitle({
      title: titleEnums[orderInfo.status],
    })
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderSn, 
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'none' })
      }
    })
  },

  copyAddress() {
    const { consignee, mobile, address } = this.data.orderInfo
    wx.setClipboardData({
      data: `${consignee}，${mobile}，${address}`, 
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'none' })
      }
    })
  },

  deliverOrder() {
    shopService.deliverOrder(id, () => {
      this.setData({
        ['orderInfo.status']: 301
      })
    })
  },

  cancelOrder() {
    shopService.cancelOrder(this.orderId, () => {
      this.setData({
        ['orderInfo.status']: 102
      })
    })
  },

  navToShipping(e) {
    const id = e.currentTarget.dataset.id
    const url = `/pages/subpages/mine/order-center/subpages/goods-order-list/subpages/shipping/index?id=${id}`
    wx.navigateTo({ url })
  },

  contact() {
  },
})
