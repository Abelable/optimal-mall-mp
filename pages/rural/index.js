import RuralService from "./utils/ruralService";

const ruralService = new RuralService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    bannerList: [],
    regionOptions: ["杭州", "杭州", "杭州", "杭州", "杭州", "杭州"],
    curRegionIdx: 0,
    regionPickerModalVisible: false,
    goodsList: []
  },

  onLoad() {
    this.setGoodsList();
  },

  async setBannerList() {
    const bannerList = await ruralService.getBannerList()
    this.setData({ bannerList })
  },

  async setGoodsList() {
    const { recommendGoodsList: goodsList } = (await ruralService.getCartList()) || {};
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
  }
});
