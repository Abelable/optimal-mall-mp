import { store } from "../../../../store/index";
import GiftService from "./utils/giftService";

const giftService = new GiftService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    curBgIdx: 0,
    livestockList: [],
    giftList: [],
    posterInfo: null,
    posterModelVisible: false
  },

  async onLoad(options) {
    const { type, superiorId = "", scene = "" } = options || {};
    const decodedScene = scene ? decodeURIComponent(scene) : "";
    this.superiorId = superiorId || decodedScene.split("-")[0];

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.promoterInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await giftService.getSuperiorInfo(this.superiorId);
        store.setPromoterInfo(superiorInfo);
      }
    });

    await this.setLiveStockList();
    await this.setGiftList();
    if (type === "2") {
      this.scrollToGift();
    }

    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
  },

  setCurBgIdx(e) {
    const curBgIdx = Number(e.detail.current);
    this.setData({ curBgIdx });
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
  },

  async share() {
    const scene =
      wx.getStorageSync("token") && store.promoterInfo
        ? `${store.promoterInfo.id}`
        : "-";
    const page = "pages/rural/subpages/gift/index";
    const qrcode = await giftService.getQRCode(scene, page);

    this.setData({
      posterModalVisible: true,
      posterInfo: { qrcode }
    });
  },

  hidePosterModal() {
    this.setData({
      posterModalVisible: false
    });
  },

  // 分享
  onShareAppMessage() {
    const { id, nickname, signature } = store.promoterInfo || {};
    const title = nickname
      ? `${nickname} ${signature || "让时间见证信任"}`
      : "让时间见证信任";
    const path = id
      ? `/pages/rural/subpages/gift/index?superiorId=${id}`
      : "/pages/rural/subpages/gift/index";
    const imageUrl = "https://static.youbozhenxuan.cn/mp/home_share_cover.png";
    return { title, imageUrl, path };
  },

  onShareTimeline() {
    const { id, nickname, signature } = store.promoterInfo || {};
    const title = nickname
      ? `${nickname} ${signature || "让时间见证信任"}`
      : "让时间见证信任";
    const query = id ? `superiorId=${id}` : "";
    const imageUrl = "https://static.youbozhenxuan.cn/mp/home_share_cover.png";
    return { query, title, imageUrl };
  }
});
