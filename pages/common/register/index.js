import { WEBVIEW_BASE_URL } from '../../../../config'
import BaseService from '../../../../services/baseService'

const baseService = new BaseService()
const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    showAuthModal: false
  },

  async getMobile(e) {
    const mobile = await baseService.getUserMobile(e.detail.code)
    if (mobile) {
      this.mobile = mobile
      this.setData({ showAuthModal: true })
    }
  },

  async getUserInfo() {
    const { userInfo } = await baseService.getUserProfile()
    this.register(userInfo)
  },

  async register(userInfo) {
    const { avatarUrl: avatar, nickName: nickname, gender } = userInfo
    const { code } = await baseService.wxLogin()
    const token = await baseService.register(code, avatar, nickname, gender, this.mobile)
    if (token) {
      wx.setStorageSync('token', token)
      wx.navigateBack()
    }
  },

  serviceAgreement() {
    wx.navigateTo({ url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/agreements/user_service` })
  },

  hideModal() {
    this.setData({ showAuthModal: false })
  },

  navToHome() {
    wx.switchTab({ url: '/pages/tab-bar-pages/home/index' })
  }
})
