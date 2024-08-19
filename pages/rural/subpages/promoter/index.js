import PromoterService from "./utils/promoterService";

const promoterService = new PromoterService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    livestockList: [],
    giftList: [],
  },

  async onLoad() {
    await this.setLiveStockList();
    this.setGiftList();
  },

  async setLiveStockList() {
    const livestockList =
      (await promoterService.getGoodsList(1)) || [];
    this.setData({ livestockList });
  },

  async setGiftList() {
    const giftList =
      (await promoterService.getGoodsList(2)) || [];
    this.setData({ giftList });
  },

  onPullDownRefresh() {
    this.setLiveStockList();
    this.setGiftList();
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
  }
});
