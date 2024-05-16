import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()

Page({
  data: {
    preOrderInfo: null,
    addressSelectPopupVisible: false
  },

  onLoad({ cartGoodsIds }) {
    this.cartGoodsIds = JSON.parse(cartGoodsIds) 
    this.setPreOrderInfo()
  },

  async setPreOrderInfo() {
    const preOrderInfo = await goodsService.getPreOrderInfo(this.cartGoodsIds, this.addressId)
    this.setData({ preOrderInfo })
  },

  showAddressSelectPopup() {
    this.setData({
      addressSelectPopupVisible: true
    })
  },

  hideAddressSelectPopup(e) {
    this.setData({
      addressSelectPopupVisible: false
    })
    if (e.detail) {
      this.addressId = e.detail
      this.setPreOrderInfo()
    }
  },

  // 提交订单
  async submit() {
    const { addressInfo, errMsg } = this.data.preOrderInfo
    const addressId = addressInfo.id
    if (!addressId) {
      return
    }
    if (errMsg) {
      return
    }
    const orderIds = await goodsService.submitOrder(this.cartGoodsIds, addressId)
    this.pay(orderIds)
  },

  async pay(orderIds) {
    const payParams = await goodsService.getPayParams(orderIds)
    wx.requestPayment({
      ...payParams,
      success: () => {
        wx.navigateTo({ 
          url: '/pages/subpages/mine/order-center/subpages/goods-order-list/index?status=2'
        })
      },
      fail: () => {
        wx.navigateTo({ 
          url: '/pages/subpages/mine/order-center/subpages/goods-order-list/index?status=1'
        })
      }
    })
  },
})
