import { checkLogin, customBack } from "../../utils/index";
import HomeService from "./utils/homeService";

const homeService = new HomeService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    cartGoodsNumber: 0,
    categoryOptions: [],
    subCategoryOptions: [],
    activeTabIdx: 0,
    activeSubTabIdx: 0,
    tabScroll: 0,
    goodsList: [],
    finished: false
  },

  async onLoad() {
    await this.setCategoryOptions();
    this.setGoodsList(true);
  },

  onShow() {
    checkLogin(() => {
      this.setCartGoodsNumber();
    }, false);
  },

  async selectCate(e) {
    const activeTabIdx = Number(e.currentTarget.dataset.idx);
    this.setData({
      activeTabIdx,
      activeSubTabIdx: 0,
      tabScroll: (activeTabIdx - 2) * 80,
    });
    if (activeTabIdx === 0) {
      this.setData({ subCategoryOptions: [] });
    } else {
      await this.setSubCategoryOptions();
    }
    this.setGoodsList(true);
  },

  selectSubCate(e) {
    const activeSubTabIdx = Number(e.currentTarget.dataset.idx);
    this.setData({ activeSubTabIdx });
    this.setGoodsList(true);
  },

  async setCategoryOptions() {
    const options = await homeService.getShopCategoryOptions();
    this.setData({
      categoryOptions: [{ id: 0, name: "推荐" }, ...options],
    });
  },

  async setSubCategoryOptions() {
    const { categoryOptions, activeTabIdx } = this.data;
    const options = await homeService.getGoodsCategoryOptions(
      categoryOptions[activeTabIdx].id
    );
    this.setData({
      subCategoryOptions: [{ id: 0, name: "全部商品" }, ...options],
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
      subCategoryOptions,
      activeSubTabIdx,
      goodsList,
    } = this.data;
    const list =
      (await homeService.getGoodsList({
        shopCategoryId: categoryOptions[activeTabIdx].id,
        categoryId: subCategoryOptions.length
          ? subCategoryOptions[activeSubTabIdx].id
          : 0,
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

  async setCartGoodsNumber() {
    const cartGoodsNumber = await homeService.getCartGoodsNumber();
    this.setData({ cartGoodsNumber });
  },

  onReachBottom() {
    this.setGoodsList();
  },

  onPullDownRefresh() {
    this.setGoodsList(true);
    wx.stopPullDownRefresh();
  },

  navBack() {
    customBack();
  },

  search() {
    wx.navigateTo({
      url: "./subpages/search/index",
    });
  },
});
