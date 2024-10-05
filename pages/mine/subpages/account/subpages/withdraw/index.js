import { store } from "../../../../../../store/index";
import AccountService from "../../utils/accountService";

const accountService = new AccountService();

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    scene: 1,
    curOptionIdx: 0,
    bancCardInfo: null,
    authModalVisible: false,
    btnActive: false
  },

  onLoad({ scene }) {
    this.setData({ scene: +scene });
  },

  onShow() {
    this.setBankCardInfo();
  },

  selectOption(e) {
    const curOptionIdx = e.currentTarget.dataset.index;
    this.setData({ curOptionIdx });
  },

  async setBankCardInfo() {
    const bancCardInfo = await accountService.getBankCardInfo();
    if (bancCardInfo) {
      const { code, ...rest } = bancCardInfo;
      this.setData({
        bancCardInfo: {
          code: `${code.slice(0, 5)}****${code.slice(-5)}`,
          ...rest
        }
      });
    }
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

  bindBank() {
    wx.navigateTo({
      url: "./subpages/bind-bank/index"
    });
  },

  withdraw() {
    if (!this.data.btnActive) {
      return;
    }
    if (store.userInfo.authInfoId) {
      wx.navigateTo({
        url: "./subpages/withdraw-result/index"
      });
    } else {
      this.setData({ authModalVisible: true });
    }
  },

  hideAuthModal() {
    this.setData({ authModalVisible: false });
  }
});
