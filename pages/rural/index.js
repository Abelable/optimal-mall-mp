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

  onLoad() {
    this.setBannerList();
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
    const { recommendGoodsList: goodsList } =
      (await ruralService.getCartList()) || {};
    this.setData({ goodsList });
  },

  selectRegion(e) {
    const curRegionIdx = e.currentTarget.dataset.index;
    this.setData({ curRegionIdx });
  },

  showRegionPickerModal() {
    this.setData({ regionPickerModalVisible: true });
  },

  hideRegionPickerModal() {
    this.setData({ regionPickerModalVisible: false });
  },

  confirmRegionPick(e) {
    this.setData({ curRegionIdx: e.detail, regionPickerModalVisible: false });
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

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
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
});
