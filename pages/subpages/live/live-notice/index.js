import { store } from "../../../../store/index";
import LiveService from "../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    roomInfo: null,
    countDown: 0,
    posterInfo: null,
    posterModalVisible: false
  },

  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    this.setRoomInfo();
  },

  async setRoomInfo() {
    const roomInfo = await liveService.getNoticeRoomInfo();
    if (roomInfo) {
      this.setData({ roomInfo });
      this.setCountDown(new Date(roomInfo.noticeTime).getTime());
    }
  },

  setCountDown(startTime) {
    const currentTime = new Date().getTime();
    let countDown = (startTime - currentTime) / 1000;
    this.setData({ countDown });
    this.countDownInterval = setInterval(() => {
      if (countDown > 0) {
        --countDown;
        this.setData({ countDown });
      } else clearInterval(this.countDownInterval);
    }, 1000);
  },

  startLive() {
    const { direction } = this.data.roomInfo;
    const url = `../live-push/${
      direction === 1 ? "vertical" : "horizontal"
    }-screen/index`;
    wx.navigateTo({ url });
  },

  async share() {
    const {
      id,
      status,
      cover,
      title,
      noticeTime,
      startTime
    } = roomInfo;

    const scene =
      wx.getStorageSync("token") && store.promoterInfo
        ? `${id}-${store.promoterInfo.id}`
        : `${id}`;
    const page = "pages/subpages/live/live-play/index";
    const qrcode = await liveService.getQRCode(scene, page);

    this.setData({
      posterModalVisible: true,
      posterInfo: {
        status,
        cover,
        title,
        authorInfo: store.userInfo,
        noticeTime,
        startTime,
        qrcode
      }
    });
  },

  hidePosterModal() {
    this.setData({
      posterModalVisible: false
    });
  },

  deleteLiveNotice() {
    wx.showModal({
      content: "确定删除直播预告吗？",
      success: result => {
        if (result.confirm) {
          liveService.deleteNoticeRoom(() => {
            wx.showToast({
              title: "删除成功",
              icon: "none"
            });
            setTimeout(() => {
              this.navBack();
            }, 2000);
          });
        }
      }
    });
  },

  navBack() {
    const pagesLength = getCurrentPages().length;
    const prePage = getCurrentPages()[pagesLength - 2];
    const prePageRoute = prePage ? prePage.route : "";
    if (prePageRoute === "pages/subpages/live/create-live/index") {
      wx.switchTab({ url: "/pages/mine/index" });
    } else {
      wx.navigateBack();
    }
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
  },

  onUnload() {
    clearInterval(this.countDownInterval);
  }
});
