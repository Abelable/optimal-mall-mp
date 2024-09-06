Page({
  data: {
    licenseList: []
  },

  async onLoad({ license }) {
    const licenseList = JSON.parse(license);
    this.setData({ licenseList });
  },

  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({ current, urls });
  },
});
