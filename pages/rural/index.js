import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import RuralService from "./utils/ruralService";

const ruralService = new RuralService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"]
  },

  data: {
    statusBarHeight,
    navBarBgVisible: false,
    bannerList: [],
    promoterTotal: 0,
    promoterList: [],
    animationData: undefined,
    rightsList: [
      { icon: "worry_free", width: "84rpx", height: "28rpx", name: "自买省心" },
      { icon: "share", width: "56rpx", height: "50rpx", name: "分享放心" },
      { icon: "team", width: "58rpx", height: "48rpx", name: "社区团购" },
      { icon: "heart", width: "56rpx", height: "50rpx", name: "IP赋能" },
      { icon: "shape", width: "58rpx", height: "58rpx", name: "专属社群" },
      { icon: "id", width: "58rpx", height: "48rpx", name: "专属身份" },
      { icon: "vip", width: "58rpx", height: "54rpx", name: "1V1服务" }
    ]
  },

  methods: {
    onLoad() {
      this.setBannerList();
      this.setPromoterList();
    },

    onShow() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.resetAnimation();
        this.startAnimation();
      }
    },

    async setBannerList() {
      const bannerList = await ruralService.getBannerList(4);
      this.setData({ bannerList });
    },

    async setPromoterList() {
      const { list: promoterList, total: promoterTotal } =
        await ruralService.getPromoterList(1, 68);
      this.setData({ promoterList, promoterTotal }, () => {
        this.initAnimation();
      });
    },

    initAnimation() {
      const query = wx.createSelectorQuery().in(this);
      query.select(".promoter-list").boundingClientRect();
      query.exec(res => {
        this.promoterListWidth = res[0].width;
        this.startAnimation();
      });
    },

    startAnimation() {
      const duration = this.promoterListWidth * 10;
      const animation = wx.createAnimation({
        duration,
        timingFunction: "linear"
      });
      animation.translateX(-this.promoterListWidth).step();
      this.setData({
        animationData: animation.export()
      });

      this.timeout = setTimeout(() => {
        this.resetAnimation();
        this.startAnimation();
      }, duration);
    },

    resetAnimation() {
      const reset = wx.createAnimation({
        duration: 0
      });
      reset.translateX(0).step();
      this.setData({
        animationData: reset.export()
      });
    },

    onPageScroll(e) {
      if (e.detail.scrollTop >= 80) {
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
  }
});
