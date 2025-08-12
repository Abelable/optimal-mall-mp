import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import HomeService from "./utils/homeService";
import { WEBVIEW_BASE_URL } from "../../config";

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
    menuList: [],
    curMenuIdx: 0,
    bannerList: [],
    middleBannerList: [],
    liveList: [],
    curDot: 1,
    activityGoodsLists: [[], [], []],
    hometownList: [
      { cover: "neimeng", name: "内蒙", desc: "辽阔草原风" },
      { cover: "hangzhou", name: "杭州", desc: "西湖映古今" },
      { cover: "wuhan", name: "武汉", desc: "江城烟雨浓" }
    ],
    goodsList: [],
    finished: false,
    adInfo: null,
    adModalVisible: false,
    posterInfo: null,
    posterModalVisible: false
  },

  methods: {
    onLoad(options) {
      const { superiorId = "", scene = "" } = options || {};
      const decodedScene = scene ? decodeURIComponent(scene) : "";
      this.superiorId = superiorId || decodedScene.split("-")[0];

      getApp().onLaunched(async () => {
        if (this.superiorId && !store.promoterInfo) {
          wx.setStorageSync("superiorId", this.superiorId);
          const superiorInfo = await homeService.getSuperiorInfo(
            this.superiorId
          );
          store.setPromoterInfo(superiorInfo);
        }
      });

      this.setAdInfo();
      this.init();
    },

    async init() {
      wx.showLoading({ title: "加载中..." });
      await this.setBannerList();
      await this.setMiddleBannerList();
      await this.setLiveList();
      await this.setMenuList();
      await this.setActivityGoodsList();
      this.setGoodsList(true);
    },

    selectMenu(e) {
      const curMenuIdx = e.currentTarget.dataset.index;
      this.setData({ curMenuIdx });
      if (!this.data.activityGoodsLists[curMenuIdx].length) {
        this.setActivityGoodsList();
      }
    },

    async setMenuList() {
      const menuList = (await homeService.getActivityTagOptions()) || [];
      this.setData({ menuList });
    },

    async setActivityGoodsList() {
      const { menuList, curMenuIdx } = this.data;
      const goodsList =
        (await homeService.getActivityList(menuList[curMenuIdx].id)) || [];
      this.setData({ [`activityGoodsLists[${curMenuIdx}]`]: goodsList });
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

    async setAdInfo() {
      const adInfo = await homeService.getAdInfo();
      if (adInfo) {
        this.setData({ adInfo, adModalVisible: true });
      }
    },

    async setBannerList() {
      const bannerList = await homeService.getBannerList();
      this.setData({ bannerList });
    },

    async setMiddleBannerList() {
      const middleBannerList = await homeService.getBannerList(2);
      this.setData({ middleBannerList });
    },

    async setLiveList() {
      const { list: liveList } = await homeService.getLiveList(1, 3);
      this.setData({ liveList });
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
        url: "/pages/subpages/common/promoter/index"
      });
    },

    search() {
      wx.navigateTo({
        url: "/pages/subpages/common/search/index"
      });
    },

    linkTo(e) {
      const { scene, param } = e.currentTarget.dataset || {};
      if (scene) {
        switch (scene) {
          case 1:
            wx.navigateTo({
              url: `/pages/subpages/common/webview/index?url=${param}`
            });
            break;

          case 2:
            wx.navigateTo({
              url: `/pages/home/subpages/goods-detail/index?id=${param}`
            });
            break;
        }
      }
    },

    navToVillageGrain() {
      wx.navigateTo({
        url: "./subpages/village-grain/index"
      });
    },

    navToVillageFresh() {
      wx.navigateTo({
        url: "./subpages/village-fresh/index"
      });
    },

    navToVillageSnack() {
      wx.navigateTo({
        url: "./subpages/village-snack/index"
      });
    },

    navToVillageGift() {
      wx.navigateTo({
        url: "./subpages/village-gift/index"
      });
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
    },

    navToHometown(e) {
      const { name = "" } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `./subpages/hometown/index?name=${name}`
      });
    },

    checkLimitedTimeActivity() {
      wx.navigateTo({
        url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/activity/limited_time_recruit`
      });
    },

    linkToLive(e) {
      const { id } = e.currentTarget.dataset;
      const url = `/pages/subpages/live/live-play/index?id=${id}`;
      wx.navigateTo({ url });
    },

    hideAdModal() {
      this.setData({
        adModalVisible: false
      });
    },

    async share() {
      const scene =
        wx.getStorageSync("token") && store.promoterInfo
          ? `${store.promoterInfo.id}`
          : "-";
      const page = "pages/home/index";
      const qrcode = await homeService.getQRCode(scene, page);

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
        ? `/pages/home/index?superiorId=${id}`
        : "/pages/home/index";
      const imageUrl =
        "https://static.chengxinxingqiu.cn/mp/home_share_cover.png";
      return { title, imageUrl, path };
    },

    onShareTimeline() {
      const { id, nickname, signature } = store.promoterInfo || {};
      const title = nickname
        ? `${nickname} ${signature || "让时间见证信任"}`
        : "让时间见证信任";
      const query = id ? `superiorId=${id}` : "";
      const imageUrl =
        "https://static.chengxinxingqiu.cn/mp/home_share_cover.png";
      return { query, title, imageUrl };
    }
  }
});
