const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    url: "",
    muted: true,
  },

  onLoad({ url }) {
    this.setData({ url });
  },

  toggleMuted() {
    this.setData({
      muted: !this.data.muted,
    });
  },
});
