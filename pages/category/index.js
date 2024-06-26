import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { WEBVIEW_BASE_URL } from "../../config";
import CategoryService from "./utils/categoryService";

const categoryService = new CategoryService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo", "teamLeaderInfo"]
  },

  data: {
    statusBarHeight,
    teamLeaderInfo: null,
    bannerList: [],
    categoryOptions: [],
    curCategoryIdx: 0,
    tabScroll: 0,
    goodsList: [],
    finished: false
  },

  methods: {
    async onLoad() {
      await this.setCategoryOptions();
      this.setGoodsList(true);
    },

    async selectCategory(e) {
      const curCategoryIdx = Number(e.currentTarget.dataset.idx);
      this.setData({ curCategoryIdx });
      this.setGoodsList(true);
    },

    async setCategoryOptions() {
      const categoryOptions = await categoryService.getCategoryOptions();
      this.setData({ categoryOptions });
    },

    async setGoodsList(init = false) {
      const limit = 10;
      if (init) {
        this.page = 0;
        this.setData({
          finished: false
        });
      }
      const { categoryOptions, curCategoryIdx, goodsList } = this.data;
      const list =
        (await categoryService.getGoodsList({
          categoryId: categoryOptions[curCategoryIdx].id,
          page: ++this.page,
          limit
        })) || [];
      this.setData({
        goodsList: init ? list : [...goodsList, ...list]
      });
      if (list.length < limit) {
        this.setData({
          finished: true
        });
      }
    },

    async setBannerList() {
      const bannerList = await categoryService.getBannerList();
      this.setData({ bannerList });
    },

    onReachBottom() {
      this.setGoodsList();
    },

    search() {
      wx.navigateTo({
        url: "/pages/common/search/index"
      });
    },

    linkTo(e) {
      const { scene, param } = e.currentTarget.dataset;
      switch (scene) {
        case 1:
          wx.navigateTo({
            url: `/pages/common/webview/index?url=${WEBVIEW_BASE_URL}${param}`
          });
          break;

        case 2:
          wx.navigateTo({
            url: `/pages/home/subpages/goods-detail/index?id=${param}`
          });
          break;
      }
    }
  }
});
