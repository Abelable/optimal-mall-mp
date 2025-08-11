import { store } from "../../../../store/index";

Page({
  data: {
    src: "",
    height: 200,
  },

  onLoad({ height }) {
    height && this.setData({ height: Number(height) });
    this.cropper = this.selectComponent("#image-cropper");
    this.cropper.upload();
  },

  upload() {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        wx.showLoading({ title: "加载中" });
        this.cropper.imgReset();
        this.setData({
          src: res.tempFilePaths[0],
        });
      },
    });
  },

  loadimage() {
    wx.hideLoading();
    this.cropper.imgReset();
  },

  clickcut(e) {
    wx.previewImage({
      current: e.detail.url,
      urls: [e.detail.url],
    });
  },

  submit() {
    this.cropper.getImg(({ url }) => {
      store.setCroppedImagePath(url);
      wx.navigateBack();
    });
  },

  cancel() {
    wx.navigateBack();
  },
});
