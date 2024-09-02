import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { WEBVIEW_BASE_URL } from "../../config";
import HomeService from "./utils/homeService";

const homeService = new HomeService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["promoterInfo"]
  },

  data: {
    statusBarHeight,
    navBarBgVisible: false,
    menuList: ["今日主推", "活动预告"],
    curMenuIdx: 0,
    bannerList: [],
    curDot: 1,
    todayGoodsList: [],
    advanceGoodsList: [],
    goodsList: [],
    finished: false
  },

  methods: {
    onLoad() {
      this.init();
    },

    async init() {
      await this.setBannerList();
      await this.setTodayGoodsList();
      await this.setAdvanceGoodsList();
      this.setGoodsList(true);
    },

    selectMenu(e) {
      const curMenuIdx = e.currentTarget.dataset.index;
      this.setData({ curMenuIdx });
    },

    async setTodayGoodsList() {
      const todayGoodsList = (await homeService.getActivityList(1)) || [];
      this.setData({ todayGoodsList });
    },

    async setAdvanceGoodsList() {
      const advanceGoodsList = (await homeService.getActivityList(2)) || [];
      this.setData({ advanceGoodsList });
    },

    async setGoodsList(init = false) {
      const limit = 10;
      if (init) {
        this.page = 0;
        this.setData({
          finished: false
        });
      }
      const { goodsList } = this.data;
      const list =
        (await homeService.getGoodsList({
          categoryId: 0,
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
      const bannerList = await homeService.getBannerList();
      this.setData({ bannerList });
    },

    bannerChange(event) {
      this.setData({
        curDot: event.detail.current + 1
      });
    },

    onReachBottom() {
      this.setGoodsList();
    },

    onPullDownRefresh() {
      this.init();
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

    checkPromoterInfo() {
      wx.navigateTo({
        url: "/pages/common/promoter/index"
      });
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
    },

    navToRuralPage() {
      wx.switchTab({
        url: "/pages/rural/index"
      });
    },

    navToIntegrityGoods() {
      wx.navigateTo({
        url: "./subpages/integrity-goods/index"
      });
    }
  }
});
