import { WEBVIEW_BASE_URL } from '../../../../../../config'
import ScenicService from './utils/scenicService'

const scenicService = new ScenicService()
const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    menuFixed: false,
    menuList: [
      { name: '全部', status: 0 }, 
      { name: '待付款', status: 1 }, 
      { name: '待发货', status: 2 }, 
      { name: '待收货', status: 3 }, 
      { name: '售后', status: 5 }
    ],
    curMenuIndex: 0,
    shopInfo: null,
    orderList: [],
    finished: false,
  },

  onLoad() {
    this.setMenuTop()
  },
  
  async onShow() {
    if (!this.data.shopInfo) {
      await this.setShopInfo()
    }
    this.setOrderList(true)
  },

  setMenuTop() {
    const query = wx.createSelectorQuery()
    query.select('.menu-wrap').boundingClientRect()
    query.exec(res => {
      if (res[0] !== null) {
        this.menuTop = res[0].top - statusBarHeight - 44
      }
    })
  },

  async setShopInfo() {
    const shopInfo = await scenicService.getShopInfo()
    this.setData({ shopInfo })
  },

  selectMenu(e) {
    const { index: curMenuIndex } = e.currentTarget.dataset
    this.setData({ curMenuIndex })
    this.setOrderList(true)
  },

  async setOrderList(init = false) {
    const limit = 10
    const { shopInfo, menuList, curMenuIndex, orderList } = this.data
    if (init) this.page = 0
    const list = await scenicService.getOrderList({ 
      shopId: shopInfo.id, 
      status: menuList[curMenuIndex].status, 
      page:  ++this.page, 
      limit
    })
    this.setData({
      orderList: init ? list : [...orderList, ...list],
    })
    if (list.length < limit) {
      this.setData({ finished: true })
    }
  },

  onPullDownRefresh() {
    this.setOrderList(true)
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    this.setOrderList()
  },

  onPageScroll(e) {
    const { menuFixed } = this.data
    if (e.scrollTop >= this.menuTop) {
      if (!menuFixed) this.setData({ menuFixed: true })
    } else {
      if (menuFixed) this.setData({ menuFixed: false })
    }
  },

  navToTicketManagement() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/scenic/ticket/list`
    wx.navigateTo({ url })
  },

  navToScenicManagement() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/scenic/spot_list`
    wx.navigateTo({ url })
  },
})
