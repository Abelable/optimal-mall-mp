import LiveService from '../../utils/liveService'

const liveService = new LiveService()

Page({
  data: {
    roomInfo: null
  },

  onLoad() {
    wx.showShareMenu({
      withShareTicket: false,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    this.setRoomInfo()
  },

  async setRoomInfo() {
    const roomInfo = await liveService.getLivePushRoomInfo()
    this.setData({ roomInfo })
  },

  onShow() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  onHide() {
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
  },

  onShareAppMessage() {
    const { id, title, shareCover: imageUrl } = this.data.roomInfo
    const path = `/pages/index/subpages/live/index?id=${id}`
    return { path, title, imageUrl }
  },
  
  onShareTimeline() {
    const { id, title, shareCover: imageUrl } = this.data.roomInfo
    const query = `id=${id}`
    return { query, title, imageUrl }
  },
})
