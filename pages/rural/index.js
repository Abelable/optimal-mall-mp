const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    curRegionIdx: 0
  },

  selectRegion(e) {
    const curRegionIdx = e.currentTarget.dataset.index;
    this.setData({ curRegionIdx });
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
  }
});
