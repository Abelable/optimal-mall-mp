import LiveService from '../../utils/liveService'

const liveService = new LiveService()

Page({
  data: {
    roomInfo: null,
  },

  async onLoad() {
    wx.showShareMenu({
      withShareTicket: false,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    this.setRoomInfo()
  },

  async setRoomInfo() {
    const roomInfo = await liveService.getPushRoomInfo()
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
    const path = `/pages/subpages/home/media/live/live-play/index?id=${id}`
    return { path, title, imageUrl }
  },

  onShareTimeline() {
    const { id, title, shareCover: imageUrl } = this.data.roomInfo
    const query = `id=${id}`
    return { query, title, imageUrl }
  },
})
