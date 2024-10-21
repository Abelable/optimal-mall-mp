import RuralService from "./utils/ruralService";

const ruralService = new RuralService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    bannerList: [],
    regionOptions: [],
    curRegionIdx: 0,
    regionPickerModalVisible: false,
    goodsList: []
  },

  async onLoad() {
    this.setBannerList();
    await this.setRegionOptions();
    this.setGoodsList();
  },

  selectRegion(e) {
    const curRegionIdx = e.currentTarget.dataset.index;
    this.setData({ curRegionIdx });
    this.setGoodsList();
  },

  showRegionPickerModal() {
    this.setData({ regionPickerModalVisible: true });
  },

  hideRegionPickerModal() {
    this.setData({ regionPickerModalVisible: false });
  },

  confirmRegionPick(e) {
    this.setData({ curRegionIdx: e.detail, regionPickerModalVisible: false });
    this.setGoodsList();
  },

  async setBannerList() {
    const bannerList = await ruralService.getBannerList();
    this.setData({ bannerList });
  },

  async setRegionOptions() {
    const regionOptions = await ruralService.getRegionOptions();
    this.setData({ regionOptions });
  },

  async setGoodsList() {
    const { regionOptions, curRegionIdx } = this.data;
    const goodsList =
      (await ruralService.getGoodsList(regionOptions[curRegionIdx].id)) || [];
    this.setData({ goodsList });
  },

  onPullDownRefresh() {
    this.setGoodsList();
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

  linkTo(e) {
    const { scene, param } = e.currentTarget.dataset;
    switch (scene) {
      case "1":
        wx.navigateTo({
          url: `/pages/common/webview/index?url=${param}`
        });
        break;

      case "2":
        wx.navigateTo({
          url: `/pages/home/subpages/goods-detail/index?id=${param}`
        });
        break;
    }
  },

  checkLivestock() {
    wx.navigateTo({
      url: "./subpages/gift/index"
    });
  },

  checkGift() {
    wx.navigateTo({
      url: "./subpages/gift/index?type=2"
    });
  }
});
