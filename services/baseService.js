import { store } from '../store/index'
import { cleanObject } from '../utils/index'
import Base from './base/index'

class BaseService extends Base {
  async login() {
    const { code } = await this.wxLogin()
    const token = await this.post({ url: `${this.baseUrl}/auth/wx_mp/login`, data: { code } })
    wx.setStorageSync('token', token || '')
  }

  async refreshToken() {
    const token = await this.get({ url: `${this.baseUrl}/auth/token_refresh` })
    if (token) {
      wx.setStorageSync('token', token)
    }
  }

  async getUserInfo() {
    const userInfo = await this.get({ url: `${this.baseUrl}/user_info`, loadingTitle: '加载中...' })
    store.setUserInfo(userInfo)
    return userInfo
  }

  async getUserRoomInfo() {
    return await this.get({ url: `${this.baseUrl}/media/live/user_room` })
  }

  async getAddressList() {
    return await this.get({ url: `${this.baseUrl}/address/list` })
  }

  async getOssConfig() {
    if (wx.getStorageSync('ossConfig')) {
      const ossConfig = JSON.parse(wx.getStorageSync('ossConfig'))
      if (new Date().getTime() < ossConfig.expire * 1000) {
        return ossConfig
      }
    }
    const ossConfig = await this.get({ url: `${this.baseUrl}/oss_config` })
    wx.setStorage({
      key: 'ossConfig',
      data: JSON.stringify(ossConfig)
    })
    return ossConfig
  }

  async getQrCode(scene, page) {
    return await this.post({ 
      url: `${this.baseUrl}/oss_config`, 
      data: { scene, page } 
    })
  }

  async getPayParams(orderIds) {
    return await this.post({
      url: `${this.baseUrl}/order/pay_params`,
      data: { orderIds }
    })
  }

  async getOrderList({ shopId, status, page, limit = 10 }) {
    const { list = [] } = await this.get({ 
      url: `${this.baseUrl}/order/list`, 
      data: cleanObject({ status, page, limit, shopId }),
      loadingTitle: '加载中...'
    }) || {}
    return list
  }
}

export default BaseService
