import { store } from "../../../../store/index";
import { checkLogin, getQueryString } from "../../../../utils/index";
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

  async onLoad({ type, superiorId = "", scene = "", q = "" }) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    const decodedScene = scene ? decodeURIComponent(scene) : "";
    const decodedQ = q ? decodeURIComponent(q) : "";
    this.superiorId =
      superiorId ||
      decodedScene.split("-")[0] ||
      getQueryString(decodedQ, "id");
    if (this.superiorId) {
      wx.setStorageSync("superiorId", this.superiorId);
    }

    await this.setLiveStockList();
    await this.setGiftList();
    if (type === "2") {
      this.scrollToGift();
    }
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

  share() {
    checkLogin(async () => {
      const scene = `superiorId=${store.promoterInfo.id}`;
      const page = "pages/rural/subpages/gift/index";
      const qrcode = await giftService.getQRCode(scene, page);

      this.setData({
        posterModalVisible: true,
        posterInfo: { qrcode }
      });
    });
  },

  hidePosterModal() {
    this.setData({
      posterModalVisible: false
    });
  },

  // 分享
  onShareAppMessage() {
    const { id, nickname, signature } = store.promoterInfo;
    const title = `${nickname} ${signature || "好物尽在诚信星球"}`;
    const path = `/pages/rural/subpages/gift/index?superiorId=${id}`;
    const imageUrl = "https://static.youbozhenxuan.cn/mp/home_share_cover.png";
    return { title, imageUrl, path };
  },

  onShareTimeline() {
    const { id, nickname, signature } = store.promoterInfo;
    const title = `${nickname} ${signature || "好物尽在诚信星球"}`;
    const query = `superiorId=${id}`;
    const imageUrl = "https://static.youbozhenxuan.cn/mp/home_share_cover.png";
    return { query, title, imageUrl };
  }
});
