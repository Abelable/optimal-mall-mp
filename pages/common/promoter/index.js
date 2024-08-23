import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";

Page({
  data: {},

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["promoterInfo"]
    });
  },

  copyMobile() {
    wx.setClipboardData({
      data: this.data.promoterInfo.mobile,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  },

  saveWxQrcode() {
    wx.downloadFile({
      url: this.data.promoterInfo.wxQrcode,
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({ title: "成功保存", icon: "none" });
          }
        });
      }
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
