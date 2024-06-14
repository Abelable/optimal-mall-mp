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
    fields: ["userInfo"]
  },

  data: {
    statusBarHeight,
    teamLeaderInfo: null,
    bannerList: [],
    categoryOptions: [],
    activeTabIdx: 0,
    tabScroll: 0,
    goodsList: [],
    finished: false
  },

  observers: {
    userInfo: function (info) {
      const { id, avatar, nickname, signature, teamLeaderId } = info || {};
      if (teamLeaderId) {
        this.setData({ teamLeaderInfo: { id, avatar, nickname, signature } });
      } else {
        this.setTeamLeaderInfo();
      }
    }
  },

  methods: {
    async onLoad() {
      this.setBannerList();
      await this.setCategoryOptions();
      this.setGoodsList(true);
    },

    async setTeamLeaderInfo() {
      const teamLeaderId = wx.getStorageSync("teamLeaderId");
      if (teamLeaderId) {
        const teamLeaderInfo = await homeService.getTeamLeaderInfo(
          teamLeaderId
        );
        this.setData({ teamLeaderInfo });
      }
    },

    async selectCate(e) {
      const activeTabIdx = Number(e.currentTarget.dataset.idx);
      this.setData({
        activeTabIdx,
        tabScroll: (activeTabIdx - 2) * 80
      });
      this.setGoodsList(true);
    },

    async setCategoryOptions() {
      const options = await homeService.getCategoryOptions();
      this.setData({
        categoryOptions: [{ id: 0, name: "推荐" }, ...options]
      });
    },

    async setGoodsList(init = false) {
      const limit = 10;
      if (init) {
        this.page = 0;
        this.setData({
          finished: false
        });
      }
      const { categoryOptions, activeTabIdx, goodsList } = this.data;
      const list =
        (await homeService.getGoodsList({
          categoryId: categoryOptions[activeTabIdx].id,
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

    onReachBottom() {
      this.setGoodsList();
    },

    onPullDownRefresh() {
      this.setGoodsList(true);
      wx.stopPullDownRefresh();
    },

    search() {
      wx.navigateTo({
        url: "./subpages/search/index"
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
