import promisify from './promisify'

export default {
  getSystemInfo: promisify(wx.getSystemInfo),
  getSetting: promisify(wx.getSetting),
  getLocation: promisify(wx.getLocation),
  request: promisify(wx.request),
  uploadFile: promisify(wx.uploadFile),
  chooseImage: promisify(wx.chooseImage),
  chooseVideo: promisify(wx.chooseVideo),
  getUserProfile: promisify(wx.getUserProfile),
  getImageInfo: promisify(wx.getImageInfo),
  requestSubscribeMessage: promisify(wx.requestSubscribeMessage),
  login: promisify(wx.login)
}