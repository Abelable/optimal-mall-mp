Page({
  data: {
    imageList: []
  },

  async onLoad({ images }) {
    const imageList = JSON.parse(images);
    this.setData({ imageList });
  },

  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({ current, urls });
  }
});
