import { store } from "../../../../../store/index";
import LiveService from "../../utils/liveService";

const liveService = new LiveService();

Page({
  data: {
    roomInfo: null
  },

  onLoad() {
    wx.showShareMenu({
      withShareTicket: false,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    this.setRoomInfo();
  },

  async setRoomInfo() {
    const roomInfo = await liveService.getPushRoomInfo();
    this.setData({ roomInfo });
  },

  onShow() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
  },

  onHide() {
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },

  onShareAppMessage() {
    const { id: superiorId } = store.promoterInfo || {};
    const { id, title, shareCover: imageUrl } = this.data.roomInfo;
    const path = superiorId
      ? `/pages/subpages/live/live-play/index?id=${id}&superiorId=${superiorId}`
      : `/pages/subpages/live/live-play/index?id=${id}}`;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { id: superiorId } = store.promoterInfo || {};
    const { id, title, shareCover: imageUrl } = this.data.roomInfo;
    title = `诚信星球直播间：${title}`;
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title, imageUrl };
  }
});
