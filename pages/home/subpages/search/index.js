import { customBack } from "../../../../utils/index";
import HomeService from "../../utils/homeService";

const homeService = new HomeService();

Page({
  data: {
    historyKeywords: [],
    hotKeywords: [],
    keywords: "",
    isSearching: false,
    goodsList: [],
    goodsFinished: false
  },

  onLoad() {
    this.setHistoryKeywords();
    this.setHotKeywords();
  },

  setKeywords(e) {
    this.setData({
      keywords: e.detail.value
    });
  },

  selectKeywords(e) {
    const { keywords } = e.currentTarget.dataset;
    this.setData({ keywords });
    this.search();
  },

  search() {
    const { keywords } = this.data;
    if (!keywords) {
      return;
    }
    homeService.saveKeywords(keywords);
    this.setGoodsList(true);
    this.setData({ isSearching: true });
  },

  cancelSearch() {
    this.setHistoryKeywords();
    this.setData({
      keywords: "",
      isSearching: false,
      goodsList: [],
      goodsFinished: false
    });
  },

  onReachBottom() {
    this.setGoodsList();
  },

  onPullDownRefresh() {
    this.setGoodsList(true);
    wx.stopPullDownRefresh();
  },

  async setGoodsList(init = false) {
    const limit = 10;
    if (init) {
      this.goodsPage = 0;
      this.setData({ goodsFinished: false });
    }
    const { keywords, goodsList } = this.data;
    const list =
      (await homeService.searchGoodsList({
        keywords,
        page: ++this.goodsPage,
        limit
      })) || [];
    this.setData({
      goodsList: init ? list : [...goodsList, ...list]
    });
    if (list.length < limit) {
      this.setData({ goodsFinished: true });
    }
  },

  async setHistoryKeywords() {
    const historyKeywords = await homeService.getHistoryKeywords();
    this.setData({ historyKeywords });
  },

  async setHotKeywords() {
    const hotKeywords = await homeService.getHotKeywords();
    this.setData({ hotKeywords });
  },

  clearHistoryKeywords() {
    wx.showModal({
      content: "确定清空历史搜索记录吗？",
      showCancel: true,
      success: result => {
        if (result.confirm) {
          this.setData({
            historyKeywords: []
          });
          homeService.clearHistoryKeywords();
        }
      }
    });
  },

  navBack() {
    customBack();
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
