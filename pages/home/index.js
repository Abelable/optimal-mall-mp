import HomeService from "./utils/homeService";

const homeService = new HomeService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    cartGoodsNumber: 0,
    categoryOptions: [],
    activeTabIdx: 0,
    tabScroll: 0,
    goodsList: [],
    finished: false
  },

  async onLoad() {
    await this.setCategoryOptions();
    this.setGoodsList(true);
  },

  async selectCate(e) {
    const activeTabIdx = Number(e.currentTarget.dataset.idx);
    this.setData({
      activeTabIdx,
      tabScroll: (activeTabIdx - 2) * 80,
    });
    this.setGoodsList(true);
  },

  async setCategoryOptions() {
    const options = await homeService.getCategoryOptions();
    this.setData({
      categoryOptions: [{ id: 0, name: "推荐" }, ...options],
    });
  },

  async setGoodsList(init = false) {
    const limit = 10;
    if (init) {
      this.page = 0;
      this.setData({
        finished: false,
      });
    }
    const {
      categoryOptions,
      activeTabIdx,
      goodsList,
    } = this.data;
    const list =
      (await homeService.getGoodsList({
        categoryId: categoryOptions[activeTabIdx].id,
        page: ++this.page,
        limit,
      })) || [];
    this.setData({
      goodsList: init ? list : [...goodsList, ...list],
    });
    if (list.length < limit) {
      this.setData({
        finished: true,
      });
    }
  },

  onReachBottom() {
    this.setGoodsList();
  },

  onPullDownRefresh() {
    this.setGoodsList(true);
    wx.stopPullDownRefresh();
  },

  search() {
    wx.navigateTo({
      url: "./subpages/search/index",
    });
  },
});
