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
    goodsLists: []
  },

  methods: {
    async onShow() {
      await this.setCategoryOptions();
      this.setGoodsLists(true);
    },

    selectCategory(e) {
      const curCategoryIdx = e.currentTarget.dataset.idx;
      this.setData({ curCategoryIdx });
      if (!this.data.goodsLists[curCategoryIdx].list.length) {
        this.setGoodsLists(true);
      }
    },

    selectSort(e) {
      const { categoryOptions, curCategoryIdx, goodsLists } = this.data;
      const curSortIdx = e.currentTarget.dataset.index;
    },

    async setCategoryOptions() {
      const categoryOptions = await categoryService.getCategoryOptions();
      const goodsLists = new Array(categoryOptions.length)
        .fill()
        .map(() => ({
          sortMenuList: [
            { name: "销量", sort: "desc" },
            { name: "价格", sort: "desc" },
            { name: "好评" },
            { name: "新品" }
          ],
          curSortIdx: 0,
          list: [],
          finished: false
        }));
      this.pageList = new Array(categoryOptions.length).fill(0);
      this.setData({ categoryOptions, goodsLists });
    },

    async setGoodsLists(init = false) {
      const { categoryOptions, curCategoryIdx, goodsLists } = this.data;
      const limit = 10;
      if (init) {
        this.pageList[curCategoryIdx] = 0;
        this.setData({
          [`goodsLists[${curCategoryIdx}].finished`]: false
        });
      }
      const list =
        (await categoryService.getGoodsList({
          categoryId: categoryOptions[curCategoryIdx].id,
          page: ++this.pageList[curCategoryIdx],
          limit
        })) || [];
      this.setData({
        [`goodsLists[${curCategoryIdx}].list`]: init
          ? list
          : [...goodsLists[curCategoryIdx].list, ...list]
      });
      if (list.length < limit) {
        this.setData({
          [`goodsLists[${curCategoryIdx}].finished`]: true
        });
      }
    },

    async setBannerList() {
      const bannerList = await categoryService.getBannerList();
      this.setData({ bannerList });
    },

    onReachBottom() {
      const { curCategoryIdx, goodsLists } = this.data;
      if (!goodsLists[curCategoryIdx].finished) {
        this.setGoodsLists();
      }
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
