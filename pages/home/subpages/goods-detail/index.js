import { createStoreBindings } from "mobx-miniprogram-bindings";
import dayjs from "dayjs";
import { store } from "../../../../store/index";
import { checkLogin } from "../../../../utils/index";
import HomeService from "../../utils/homeService";

const homeService = new HomeService();
const { statusBarHeight } = getApp().globalData.systemInfo;
const navBarHeight = statusBarHeight + 44;

Page({
  data: {
    statusBarHeight,
    showNavBar: false,
    commentActive: false,
    realImagesActive: false,
    detailActive: false,
    curDot: 1,
    muted: true,
    goodsInfo: null,
    goodsNumber: 1,
    selectedSkuIndex: 0,
    commission: 0,
    commissionVisible: false,
    countdown: 0,
    bottomPrice: 0,
    evaluationSummary: null,
    recommendGoodsList: [],
    finished: false,
    cartGoodsNumber: 0,
    couponPopupVisible: false,
    servicePopupVisible: false,
    selectedSpecDesc: "",
    specPopupVisible: false,
    actionMode: 0,
    posterInfo: null,
    posterModelVisible: false,
    topBtnVisible: false,
    addressPopupVisible: false
  },

  async onLoad(options) {
    const { id, superiorId = "", scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.goodsId = id || decodedSceneList[0];
    this.superiorId = superiorId || decodedSceneList[1];

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.promoterInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await homeService.getSuperiorInfo(this.superiorId);
        store.setPromoterInfo(superiorInfo);
      }
    });

    this.getBannerHeight();
    this.init();

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["promoterInfo", "userInfo"]
    });

    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
  },

  onShow() {
    checkLogin(() => {
      this.setCartGoodsNumber();
    }, false);
  },

  async init() {
    await this.setGoodsInfo();
    await this.setEvaluationSummary();
    this.setBottomPrice();
    this.setCommisstion();
    this.setCountdown();
    this.setRecommendGoodsList(true);
    this.getCommentTop();
    this.getRealImagesTop();
    this.getDetailTop();
  },

  async setGoodsInfo() {
    const goodsInfo = await homeService.getGoodsInfo(
      this.goodsId,
      this.addressId
    );
    this.setData({ goodsInfo });
  },

  async setEvaluationSummary() {
    const evaluationSummary = await homeService.getGoodsEvaluationSummary(
      this.goodsId
    );
    this.setData({ evaluationSummary });
  },

  setBottomPrice() {
    const { goodsInfo, selectedSkuIndex } = this.data;
    const { price, couponList, skuList } = goodsInfo;
    const basePrice = skuList.length ? skuList[selectedSkuIndex].price : price;

    if (couponList.length) {
      const bottomPrice = couponList.map(
        ({ type, numLimit, priceLimit, denomination }) => {
          switch (type) {
            case 1:
              return Math.round((basePrice - denomination) * 100) / 100;
            case 2:
              return (
                Math.round(
                  ((basePrice * numLimit - denomination) / numLimit) * 100
                ) / 100
              );
            case 3:
              return priceLimit <= basePrice
                ? Math.round((basePrice - denomination) * 100) / 100
                : 0;
          }
        }
      )[0];
      this.setData({ bottomPrice });
    }
  },

  setCountdown() {
    if (this.data.goodsInfo.activityInfo) {
      const { status, startTime, endTime } = this.data.goodsInfo.activityInfo;
      if (status === 0) {
        const countdown = Math.floor(
          (dayjs(startTime).valueOf() - dayjs().valueOf()) / 1000
        );
        this.setData({ countdown });
        this.startCountdown();
      } else if (status === 1 && endTime) {
        const countdown = Math.floor(
          (dayjs(endTime).valueOf() - dayjs().valueOf()) / 1000
        );
        this.setData({ countdown });
        this.startCountdown();
      }
    }
  },

  startCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.countdownInterval = setInterval(() => {
      if (this.data.countdown === 0) {
        clearInterval(this.countdownInterval);
        return;
      }
      this.setData({
        countdown: this.data.countdown - 1
      });
    }, 1000);
  },

  async setRecommendGoodsList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    const { goodsInfo, recommendGoodsList } = this.data;
    const { id, categoryIds } = goodsInfo;

    const list = await homeService.getRecommedGoodsList(
      [id],
      categoryIds,
      ++this.page
    );
    this.setData({
      recommendGoodsList: init ? list : [...recommendGoodsList, ...list]
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  async setCartGoodsNumber() {
    const cartGoodsNumber = await homeService.getCartGoodsNumber();
    this.setData({ cartGoodsNumber });
  },

  getBannerHeight() {
    const query = wx.createSelectorQuery();
    query.select(".banner-wrap").boundingClientRect();
    query.exec(res => {
      this.bannerHeight = res[0].height;
    });
  },

  // 获取详情部分离窗口顶部的距离
  getCommentTop() {
    if (this.data.evaluationSummary.total) {
      const query = wx.createSelectorQuery();
      query.select(".ref-comment").boundingClientRect();
      query.exec(res => {
        if (res[0] !== null) {
          this.commentTop = res[0].top - 8;
        }
      });
    }
  },

  getRealImagesTop() {
    if (this.data.goodsInfo.detailImageList.length) {
      const query = wx.createSelectorQuery();
      query.select(".ref-real-images").boundingClientRect();
      query.exec(res => {
        if (res[0] !== null) {
          this.realImagesTop = res[0].top - 8;
        }
      });
    }
  },

  // 获取详情部分离窗口顶部的距离
  getDetailTop() {
    const query = wx.createSelectorQuery();
    query.select(".goods-detail-line").boundingClientRect();
    query.exec(res => {
      if (res[0] !== null) {
        this.detailTop = res[0].top - 12;
      }
    });
  },

  showCouponPopup() {
    this.setData({ couponPopupVisible: true });
  },

  hideCouponPopup() {
    this.setData({ couponPopupVisible: false });
  },

  receiveCoupon(e) {
    const { index } = e.detail;
    const { couponList } = this.data.goodsInfo;
    const { id, receivedNum } = couponList[index];
    homeService.receiveCoupon(id, () => {
      this.setData({
        [`goodsInfo.couponList[${index}].isReceived`]: 1,
        [`goodsInfo.couponList[${index}].receivedNum`]: receivedNum + 1
      });
    });
  },

  showAddressPopup() {
    this.setData({
      addressPopupVisible: true
    });
  },

  showServicePopup() {
    this.setData({ servicePopupVisible: true });
  },

  hideServicePopup() {
    this.setData({ servicePopupVisible: false });
  },

  confirmAddressSelect(e) {
    this.addressId = e.detail.id;
    this.setGoodsInfo();
    this.setCommisstion();
    this.hideAddressPopup();
  },

  hideAddressPopup() {
    this.setData({
      addressPopupVisible: false
    });
  },

  onReachBottom() {
    this.setRecommendGoodsList();
  },

  onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },

  // 监听滚动
  onPageScroll(e) {
    const { showNavBar, commentActive, realImagesActive, detailActive } =
      this.data;

    // 控制导航栏显隐
    if (e.scrollTop >= this.bannerHeight - navBarHeight) {
      if (!showNavBar) {
        this.setData({ showNavBar: true, topBtnVisible: true });
      }
    } else {
      if (showNavBar) {
        this.setData({ showNavBar: false, topBtnVisible: false });
      }
    }

    // 控制导航栏tab的状态切换
    if (this.commentTop && this.realImagesTop) {
      if (e.scrollTop < this.commentTop - navBarHeight) {
        if (commentActive) this.setData({ commentActive: false });
        if (realImagesActive) this.setData({ realImagesActive: false });
        if (detailActive) this.setData({ detailActive: false });
      } else if (
        e.scrollTop >= this.commentTop - navBarHeight &&
        e.scrollTop < this.realImagesTop - navBarHeight
      ) {
        if (!commentActive) this.setData({ commentActive: true });
        if (realImagesActive) this.setData({ realImagesActive: false });
        if (detailActive) this.setData({ detailActive: false });
      } else if (
        e.scrollTop >= this.realImagesTop - navBarHeight &&
        e.scrollTop < this.detailTop - navBarHeight
      ) {
        if (commentActive) this.setData({ commentActive: false });
        if (!realImagesActive) this.setData({ realImagesActive: true });
        if (detailActive) this.setData({ detailActive: false });
      } else {
        if (commentActive) this.setData({ commentActive: false });
        if (realImagesActive) this.setData({ realImagesActive: false });
        if (!detailActive) this.setData({ detailActive: true });
      }
    }

    if (this.commentTop && !this.realImagesTop) {
      if (e.scrollTop < this.commentTop - navBarHeight) {
        if (commentActive) this.setData({ commentActive: false });
        if (detailActive) this.setData({ detailActive: false });
      } else if (
        e.scrollTop >= this.commentTop - navBarHeight &&
        e.scrollTop < this.detailTop - navBarHeight
      ) {
        if (!commentActive) this.setData({ commentActive: true });
        if (detailActive) this.setData({ detailActive: false });
      } else {
        if (commentActive) this.setData({ commentActive: false });
        if (!detailActive) this.setData({ detailActive: true });
      }
    }

    if (!this.commentTop && this.realImagesTop) {
      if (e.scrollTop < this.realImagesTop - navBarHeight) {
        if (realImagesActive) this.setData({ realImagesActive: false });
        if (detailActive) this.setData({ detailActive: false });
      } else if (
        e.scrollTop >= this.realImagesTop - navBarHeight &&
        e.scrollTop < this.detailTop - navBarHeight
      ) {
        if (!realImagesActive) this.setData({ realImagesActive: true });
        if (detailActive) this.setData({ detailActive: false });
      } else {
        if (realImagesActive) this.setData({ realImagesActive: false });
        if (!detailActive) this.setData({ detailActive: true });
      }
    }

    if (!this.commentTop && !this.realImagesTop) {
      if (e.scrollTop < this.detailTop - navBarHeight) {
        if (detailActive) this.setData({ detailActive: false });
      } else {
        if (!detailActive) this.setData({ detailActive: true });
      }
    }
  },

  // 滚动到顶部
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },

  // 滚动到评价部分
  scrollToComment() {
    wx.pageScrollTo({
      scrollTop: this.commentTop - navBarHeight
    });
  },

  scrollToRealImages() {
    wx.pageScrollTo({
      scrollTop: this.realImagesTop - navBarHeight
    });
  },

  // 滚动到详情部分
  scrollToDetail() {
    wx.pageScrollTo({
      scrollTop: this.detailTop - navBarHeight
    });
  },

  bannerChange(event) {
    this.setData({
      curDot: event.detail.current + 1
    });
  },

  toggleMuted() {
    this.setData({
      muted: !this.data.muted
    });
  },

  fullScreenPlay() {
    const { video } = this.data.goodsInfo;
    const url = `/pages/common/video-play/index?url=${video}`;
    wx.navigateTo({ url });
  },

  // 图片预览
  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({ current, urls });
  },

  // 通过遮罩关闭弹窗
  hideModal() {
    this.data.shareModalVisible && this.setData({ shareModalVisible: false });
    this.data.posterModalVisible && this.setData({ posterModalVisible: false });
    this.data.showMask && this.setData({ showMask: false });
  },

  showSpecPopup(e) {
    const { status, stock } = this.data.goodsInfo;
    if (status === 1 && stock) {
      const { mode = 0 } = e.currentTarget.dataset;
      this.setData({
        couponPopupVisible: false,
        specPopupVisible: true,
        actionMode: mode
      });
    }
  },

  selectSpec(e) {
    const { selectedSkuIndex, count: goodsNumber } = e.detail;
    this.setData({ selectedSkuIndex, goodsNumber });
    this.setBottomPrice();
    this.setCommisstion();
  },

  addCartSuccess(e) {
    const { cartGoodsNumber } = e.detail;
    this.setData({ cartGoodsNumber, specPopupVisible: false });
  },

  hideSpecPopup() {
    this.setData({ specPopupVisible: false });
  },

  setCommisstion() {
    // todo 佣金 =（商品价格 * 商品数量 - 优惠券）* 商品佣金

    const { goodsInfo, selectedSkuIndex } = this.data;
    const {
      skuList = [],
      price: basePrice,
      commissionRate: baseCommissionRate
    } = goodsInfo;
    const { price: skuPrice = 0, commissionRate: skuCommissionRate = 0 } =
      skuList[selectedSkuIndex] || {};
    const price = skuPrice || basePrice;
    const commissionRate = skuCommissionRate || baseCommissionRate;
    const commission = Math.round(price * commissionRate) / 100;
    this.setData({ commission });
  },

  toggleCommissionVisible() {
    this.setData({ commissionVisible: !this.data.commissionVisible });
  },

  async share() {
    const { cover, name, introduction, couponList, price, isGift } =
      this.data.goodsInfo;

    const scene =
      wx.getStorageSync("token") && store.promoterInfo
        ? `${this.goodsId}-${store.promoterInfo.id}`
        : `${this.goodsId}`;
    const page = "pages/home/subpages/goods-detail/index";
    const qrcode = await homeService.getQRCode(scene, page);

    this.setData({
      posterModalVisible: true,
      posterInfo: {
        cover,
        name,
        introduction,
        couponList,
        price,
        isGift,
        qrcode
      }
    });
  },

  hidePosterModal() {
    this.setData({
      posterModalVisible: false
    });
  },

  checkLicense() {
    const { license } = this.data.goodsInfo.merchantInfo;
    const url = `./subpages/license/index?license=${JSON.stringify(license)}`;
    wx.navigateTo({ url });
  },

  checkRealImages() {
    const { realImageList } = this.data.goodsInfo;
    const url = `./subpages/real-images/index?images=${JSON.stringify(realImageList)}`;
    wx.navigateTo({ url });
  },

  checkEvaluationDetail() {
    const { avgScore } = this.data.evaluationSummary;
    const url = `./subpages/evaluation-list/index?goodsId=${this.goodsId}&avgScore=${avgScore}`;
    wx.navigateTo({ url });
  },

  subscribe() {
    const { id, isSubscribed } = this.data.goodsInfo.activityInfo;
    if (!isSubscribed) {
      homeService.subscribeActivity(id, () => {
        this.setData({
          ["goodsInfo.activityInfo.isSubscribed"]: 1
        });
        wx.showToast({
          title: "订阅成功",
          icon: "none"
        });
      });
    }
  },

  onUnload() {
    clearInterval(this.countdownInterval);
    this.storeBindings.destroyStoreBindings();
  },

  onShareAppMessage() {
    const { goodsInfo, promoterInfo } = this.data;
    const { id, name: title, cover: imageUrl } = goodsInfo;
    const path = promoterInfo
      ? `/pages/home/subpages/goods-detail/index?id=${id}&superiorId=${promoterInfo.id}`
      : `/pages/home/subpages/goods-detail/index?id=${id}`;
    return { title, imageUrl, path };
  },

  onShareTimeline() {
    const { goodsInfo, promoterInfo } = this.data;
    const { id, name, image: imageUrl } = goodsInfo;
    const title = `诚信星球商品：${name}`;
    const query = promoterInfo
      ? `id=${id}`
      : `id=${id}&superiorId=${promoterInfo.id}`;
    return { query, title, imageUrl };
  }
});
