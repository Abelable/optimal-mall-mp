import LiveService from "../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    menuList: [
      { name: "全部", value: 0 },
      { name: "直播中", value: 1 },
      { name: "直播预告", value: 3 }
    ],
    curMenuIdx: 0,
    liveList: [],
    finished: false
  },

  onLoad() {
    this.setLiveList(true);
  },

  selectMenu(e) {
    const curMenuIdx = e.currentTarget.dataset.index;
    this.setData({ curMenuIdx });
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
    const { menuList, curMenuIdx, liveList } = this.data;
    if (init) {
      this.page = 0;
    }

    const { list = [] } =
      (await liveService.getLiveList({
        status: menuList[curMenuIdx].value,
        page: ++this.page,
        loadingTitle: '加载中...'
      })) || {};
    this.setData({ liveList: init ? list : [...liveList, ...list] });

    if (!list.length) {
      this.setData({ finished: true });
    }
  }
});
