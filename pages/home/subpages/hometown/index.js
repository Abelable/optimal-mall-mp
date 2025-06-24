import RuralService from "./utils/ruralService";

const ruralService = new RuralService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    menuFixed: false,
    regionOptions: [],
    curRegionIdx: 0,
    regionPickerModalVisible: false,
    goodsList: []
  },

  async onLoad(options) {
    this.curRegionName = options.name || "";
    await this.setRegionOptions();
    this.setMenuTop();
    this.setGoodsList();
  },

  setMenuTop() {
    const query = wx.createSelectorQuery();
    query.select(".region-menu-wrap").boundingClientRect();
    query.exec(res => {
      this.menuTop = res[0].top;
    });
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

  async setRegionOptions() {
    const regionOptions = await ruralService.getRegionOptions();

    const curRegionIdx = regionOptions.findIndex(
      item => item.name === this.curRegionName
    );

    this.setData({
      regionOptions,
      curRegionIdx: curRegionIdx === -1 ? 0 : curRegionIdx
    });
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
    const { navBarBgVisible, menuFixed } = this.data;

    if (e.scrollTop >= 10) {
      if (!navBarBgVisible) {
        this.setData({ navBarBgVisible: true });
      }
    } else {
      if (navBarBgVisible) {
        this.setData({ navBarBgVisible: false });
      }
    }

    if (e.scrollTop >= this.menuTop - statusBarHeight - 44) {
      if (!menuFixed) this.setData({ menuFixed: true });
    } else {
      if (menuFixed) this.setData({ menuFixed: false });
    }
  }
});
