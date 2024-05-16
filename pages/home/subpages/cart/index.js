import { checkLogin, customBack } from '../../../../../../utils/index'
import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()
const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    cartList: [],
    recommendGoodsList: [],
    isSelectAll: false,
    totalPrice: 0,
    selectedCount: 0,
    deleteBtnVisible: false,
    goodsInfo: null,
    cartInfo: null,
    specPopupVisible: false,
  },

  onShow() {
    checkLogin(this.init)
  },

  async init() {
    const { cartList: list, recommendGoodsList } = await goodsService.getCartList() || {}
    const cartList = list.map(item => ({
      ...item,
      checked: false,
      goodsList: item.goodsList.map(_item => ({
        ..._item, 
        checked: false
      }))
    }))
    this.setData({ cartList, recommendGoodsList })
  },

  /**
   * 切换购物车列表选中状态
   */
  async toggleCartChecked(e) {
    const { index } = e.currentTarget.dataset
    let { cartList, deleteBtnVisible } = this.data
    let checkStatus = cartList[index].checked
    cartList[index].checked = !checkStatus
    cartList[index].goodsList.map(item => {
      if (deleteBtnVisible || (!deleteBtnVisible && item.status === 1)) {
        item.checked = !checkStatus
      }
    })
    this.setData({ cartList }, () => {
      this.acount()
    })
  },

  /**
   * 切换商品列表选中状态
   */
  async toggleGoodsChecked(e) {
    const { cartIndex, goodsIndex } = e.currentTarget.dataset
    let { cartList, deleteBtnVisible } = this.data
    let goodsCheckStatus = cartList[cartIndex].goodsList[goodsIndex].checked
    cartList[cartIndex].goodsList[goodsIndex].checked = !goodsCheckStatus
    let unCheckedIndex = cartList[cartIndex].goodsList.findIndex(item => {
      if (deleteBtnVisible || (!deleteBtnVisible && item.status === 1)) return item.checked === false
    })
    cartList[cartIndex].checked = unCheckedIndex === -1
    this.setData({ cartList }, () => {
      this.acount()
    })
  },

  /**
   * 切换全选状态
   */
  toggleAllChecked(){
    let { cartList, isSelectAll, deleteBtnVisible } = this.data
    if (deleteBtnVisible) {
      cartList.map(item => {
        item.checked = !isSelectAll
        item.goodsList.map(_item => {
          _item.checked = !isSelectAll
        })
      })
      this.setData({ cartList }, () => {
        this.acount()
      })
    } else {
      cartList.map(item => {
        item.checked = !isSelectAll
        item.goodsList.map(_item => {
          if (_item.status === 1) _item.checked = !isSelectAll
        })
      })
      this.setData({ cartList }, () => {
        this.acount()
      })
    }
  },

  async countChange(e) {
    const { cartIndex, goodsIndex } = e.currentTarget.dataset
    const { id, goodsId, selectedSkuIndex } = this.data.cartList[cartIndex].goodsList[goodsIndex]
    goodsService.editCart(id, goodsId, selectedSkuIndex, e.detail, () => {
      this.setData({ 
        [`cartList[${cartIndex}].goodsList[${goodsIndex}].number`]: e.detail
      }, () => {
        this.acount()
      })
    })
  },

  deleteGoodsList() {
    this.data.selectedCount && wx.showModal({
      title: '提示',
      content: '确定删除这些商品吗？',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          goodsService.deleteCartList(this.selectedCartIdArr, () => {
            this.init()
          })
        }
      }
    })
  },

  async deleteGoods(e) {
    const { id, cartIndex, goodsIndex } = e.currentTarget.dataset
    const { position, instance } = e.detail
    if (position === 'right') {
      wx.showModal({
        title: '提示',
        content: '确定删除该商品吗？',
        showCancel: true,
        success: async res => {
          if (res.confirm) {
            goodsService.deleteCartList(
              [id], 
              () => {
                const goodsList = this.data.cartList[cartIndex].goodsList
                goodsList.splice(goodsIndex, 1)
                if (goodsList.length) {
                  this.setData({
                    [`cartList[${cartIndex}].goodsList`]: goodsList
                  })
                } else {
                  const cartList = this.data.cartList
                  cartList.splice(cartIndex, 1)
                  this.setData({ cartList })
                  if (!cartList.length) {
                    this.init()
                  }
                }
                this.acount()
                instance.close()
              }
            )
          } else {
            instance.close()
          }
        }
      })
    }
  },

  async showSpecPopup(e) {
    const { info: cartInfo, cartIndex, goodsIndex } = e.currentTarget.dataset
    const goodsInfo = await goodsService.getGoodsInfo(cartInfo.goodsId)
    this.setData({
      cartInfo,
      goodsInfo,
      specPopupVisible: true
    })
    this.editingCartIndex = cartIndex
    this.editingGoodsIndex = goodsIndex
  },

  hideSpecPopup(e) {
    const cartInfo = this.data.cartList[this.editingCartIndex].goodsList[this.editingGoodsIndex]
    this.setData({ 
      [`cartList[${this.editingCartIndex}].goodsList[${this.editingGoodsIndex}]`]: {
        ...cartInfo,
        ...e.detail.cartInfo
      },
      specPopupVisible: false
    }, () => {
      this.acount()
    })
  },

  toggleDeleteBtnVisible() {
    this.setData({
      deleteBtnVisible: !this.data.deleteBtnVisible
    })
  },

  acount() {
    this.totalCount = 0
    let selectedCount = 0
    let totalPrice = 0
    this.selectedCartIdArr = []

    const { cartList, deleteBtnVisible } = this.data

    if (deleteBtnVisible) {
      cartList.forEach(item => {
        item.goodsList.forEach(_item => {
          if (_item.checked) {
            this.selectedCartIdArr.push(_item.id)
            selectedCount += _item.number
          }
          this.totalCount += _item.number
        })
      })
      this.setData({ 
        selectedCount,
        isSelectAll: selectedCount && selectedCount === this.totalCount
      })
    } else {
      cartList.forEach(item => {
        item.goodsList.forEach(_item => {
          if (_item.status === 1 && _item.checked) {
            this.selectedCartIdArr.push(_item.id)
            selectedCount += _item.number
            totalPrice += _item.number * _item.price
          }
          this.totalCount += _item.number
        })
      })
      this.setData({ 
        selectedCount, 
        totalPrice,
        isSelectAll: selectedCount && selectedCount === this.totalCount
      })
    }
  },

  submit(){
    if (this.data.selectedCount) {
      wx.navigateTo({ 
        url: `/pages/subpages/mall/goods/subpages/order-check/index?cartGoodsIds=${JSON.stringify(this.selectedCartIdArr)}` 
      })
    }
  },

  navToShop(e) {
    wx.navigateTo({ 
      url: `/pages/subpages/mall/goods/subpages/shop/index?id=${e.currentTarget.dataset.id}`
    })
  },

  showGoodsDetail(e){
    wx.navigateTo({ 
      url: `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${e.currentTarget.dataset.id}`
    })
  },

  navBack() {
    customBack()
  },

  catchtap() {}
})
