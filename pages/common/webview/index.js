import { checkLogin } from '../../../../utils/index'

Page({
  data: {
    url: ''
  },

  async onLoad(options) {
    let { url, ...rest } = options
    for (let key in rest) {
      if (rest.hasOwnProperty(key) && rest[key]) url += `${url.indexOf('?') === -1 ? '?' : '&'}${key}=${rest[key]}`
    }
    this.webviewUrl = url
  },

  onShow() {
    setTimeout(() => {
      checkLogin(() => {
        this.setData({
          url: `${this.webviewUrl}${this.webviewUrl.indexOf('?') === -1 ? '?' : '&'}token=${wx.getStorageSync('token')}`
        })
      }, false)
    })
  },

  onShareAppMessage() {
    const path = `/pages/subpages/subpages/common/webview/index?url=${this.webviewUrl.replace('?', '&')}`
    return { path }
  }
})
