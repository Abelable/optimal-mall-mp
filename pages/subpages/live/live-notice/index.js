import LiveService from "../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    roomInfo: null,
    countDown: 0
  },

  onLoad() {
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

  onUnload() {
    clearInterval(this.countDownInterval);
  }
});
