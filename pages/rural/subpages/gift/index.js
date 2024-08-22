import GiftService from "./utils/giftService";

const giftService = new GiftService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    livestockList: [],
    giftList: []
  },

  async onLoad({ type }) {
    await this.setLiveStockList();
    await this.setGiftList();
    if (type === "1") {
      this.scrollToLivestock();
    } else {
      this.scrollToGift();
    }
  },

  scrollToLivestock() {
    const query = wx.createSelectorQuery();
    query.select(".livestock-title").boundingClientRect();
    query.exec(res => {
      wx.pageScrollTo({ scrollTop: res[0].top - statusBarHeight - 56 });
    });
  },

  scrollToGift() {
    const query = wx.createSelectorQuery();
    query.select(".gift-title").boundingClientRect();
    query.exec(res => {
      wx.pageScrollTo({ scrollTop: res[0].top - statusBarHeight - 56 });
    });
  },

  async setLiveStockList() {
    const livestockList = (await giftService.getGoodsList(1)) || [];
    this.setData({ livestockList });
  },

  async setGiftList() {
    const giftList = (await giftService.getGoodsList(2)) || [];
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
