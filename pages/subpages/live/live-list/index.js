import LiveService from "../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    liveList: [],
    finished: false
  },

  onLoad() {
    this.setLiveList(true);
  },

  onReachBottom() {
    this.setLiveList();
  },

  onPullDownRefresh() {
    this.setLiveList(true);
    wx.stopPullDownRefresh();
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: true });
      }
    } else {
      if (this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: false });
      }
    }
  },

  async setLiveList(init = false) {
    if (init) {
      this.page = 0;
    }

    const { list = [] } =
      (await liveService.getLiveList({ page: ++this.page })) || {};
    this.setData({ liveList: init ? list : [...this.data.liveList, ...list] });

    if (!list.length) {
      this.setData({ finished: true });
    }
  }
});
