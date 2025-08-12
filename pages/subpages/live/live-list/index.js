import LiveService from "../utils/liveService";

const liveService = new LiveService();

Page({
  data: {
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
