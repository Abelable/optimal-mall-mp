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
    this.setGoodsList(true);
  },

  async setBannerList() {
    const bannerList = await ruralService.getBannerList();
    this.setData({ bannerList });
  },

  async setRegionOptions() {
    const regionOptions = await ruralService.getRegionOptions();
    this.setData({ regionOptions });
  },

  async setGoodsList(init = false) {
    const { regionOptions, curRegionIdx, goodsList } = this.data;
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    const { list = [] } =
      (await ruralService.getGoodsList(
        regionOptions[curRegionIdx].id,
        ++this.page
      )) || {};
    this.setData({ 
      goodsList: init ? list : [...goodsList, ...list] 
    });
    if (!list.length) {
      this.setData({ finished: true })
    }
  },

  selectRegion(e) {
    const curRegionIdx = e.currentTarget.dataset.index;
    this.setData({ curRegionIdx });
    this.setGoodsList(true);
  },

  showRegionPickerModal() {
    this.setData({ regionPickerModalVisible: true });
  },

  hideRegionPickerModal() {
    this.setData({ regionPickerModalVisible: false });
  },

  confirmRegionPick(e) {
    this.setData({ curRegionIdx: e.detail, regionPickerModalVisible: false });
    this.setGoodsList(true);
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
    this.setGoodsList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setGoodsList();
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
