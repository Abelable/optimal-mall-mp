import { WEBVIEW_BASE_URL } from "../../../../config";
import { store } from "../../../../store/index";
import MineService from "../../utils/mineService";

const mineService = new MineService();

Page({
  data: {
    version: "",
    wxQrcode: "",
    signature: "",
    level: 0
  },

  onLoad() {
    const { version = "1.0.0" } = wx.getAccountInfoSync().miniProgram;
    this.setData({ version });

    const { wxQrcode, signature, level } = store.userInfo;
    this.setData({ wxQrcode, signature, level });
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

  checkAuthInfo() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/auth`;
    wx.navigateTo({ url });
  },

  onUnload() {
    const { wxQrcode, signature } = this.data;
    mineService.updateUserInfo(
      { ...store.userInfo, wxQrcode, signature },
      () => {
        store.setUserInfo({ ...store.userInfo, wxQrcode, signature });
      }
    );
  }
});
