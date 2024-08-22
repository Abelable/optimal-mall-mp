import { store } from "../../../../store/index";
import MineService from "../../utils/mineService";

const mineService = new MineService();

Page({
  data: {
    wxQrcode: "",
    signature: ""
  },

  onLoad() {
    const { wxQrcode, signature } = store.userInfo;
    this.setData({ wxQrcode, signature });
  },

  uploadWxQrcode() {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: async res => {
        wx.showLoading({ title: "上传中" });
        const wxQrcode = await mineService.uploadFile(res.tempFilePaths[0]);
        this.setData({ wxQrcode });
        wx.hideLoading();
      }
    });
  },

  setSignature(e) {
    const signature = e.detail.value;
    this.setData({ signature });
  },

  onUnload() {
    const { wxQrcode, signature } = this.data;
    mineService.updateUserInfo({ ...store.userInfo, wxQrcode, signature }, () => {
      store.setUserInfo({ ...store.userInfo, avatar, nickname });
    });
  }
});
