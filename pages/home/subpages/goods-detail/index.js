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
    // 导航栏相关
    showNavBar: false, // 导航栏显隐
    commentActive: false,
    detailActive: false,
    // 轮播图相关
    curDot: 1,
    muted: true,
    goodsInfo: null,
    countdown: 0,
    bottomPrice: 0,
    evaluationSummary: null,
    recommendGoodsList: [],
    finished: false,
    cartGoodsNumber: 0,
    couponPopupVisible: false,
    // 规格相关
    selectedSpecDesc: "",
    specPopupVisible: false,
    actionMode: 0,
    posterInfo: null,
    posterModelVisible: false,
    topBtnVisible: false,
    addressSelectPopupVisible: false
  },

  async onLoad({ id, superiorId, scene }) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["promoterInfo"]
    });

    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.goodsId = id || decodedSceneList[0];
    this.superiorId = superiorId || decodedSceneList[1];
    if (this.superiorId && !store.promoterInfo) {
      wx.setStorageSync("superiorId", this.superiorId);
    }

    this.getBannerHeight();
    this.init();
  },

  onShow() {
    checkLogin(() => {
      this.setCartGoodsNumber();
    }, false);
  },

  async init() {
    await this.setGoodsInfo();
    await this.setEvaluationSummary();
    this.getCommentTop();
    this.getDetailTop();
    this.setBottomPrice();
    this.setCountdown();
    this.setRecommendGoodsList(true);
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
    const { price, couponList } = this.data.goodsInfo;
    if (couponList.length) {
      const bottomPrice = couponList.map(
        ({ type, numLimit, priceLimit, denomination }) => {
          switch (type) {
            case 1:
              return Math.floor((price - denomination) * 100) / 100;
            case 2:
              return (
                Math.floor(
                  ((price * numLimit - denomination) / numLimit) * 100
                ) / 100
              );
            case 3:
              return priceLimit <= price
                ? Math.floor((price - denomination) * 100) / 100
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
    const query = wx.createSelectorQuery();
    query.select(".comment-summary-wrap").boundingClientRect();
    query.exec(res => {
      if (res[0] !== null) {
        this.commentTop = res[0].top - 8;
      }
    });
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

  showAddressSelectPopup() {
    this.setData({
      addressSelectPopupVisible: true
    });
  },

  confirmAddressSelect(e) {
    this.addressId = e.detail.id;
    this.setGoodsInfo();
    this.hideAddressSelectPopup();
  },

  hideAddressSelectPopup() {
    this.setData({
      addressSelectPopupVisible: false
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
    const { showNavBar, commentActive, detailActive } = this.data;

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

  // 客服
  contact() {
    if (this.data.goodsInfo.shopInfo) {
      const { id, name, avatar } = this.data.goodsInfo.shopInfo.keeperInfo;
      const url = `/pages/subpages/news/chat/index?userId=${id}&name=${name}&avatar=${avatar}&goodsId=${this.goodsId}`;
      wx.navigateTo({ url });
    }
  },

  // 通过遮罩关闭弹窗
  hideModal() {
    this.data.shareModalVisible && this.setData({ shareModalVisible: false });
    this.data.posterModalVisible && this.setData({ posterModalVisible: false });
    this.data.showMask && this.setData({ showMask: false });
  },

  // 显示规格弹窗
  showSpecPopup(e) {
    if (this.data.goodsInfo.stock) {
      const { mode = 0 } = e.currentTarget.dataset;
      this.setData({
        specPopupVisible: true,
        actionMode: mode
      });
    }
  },

  // 关闭规格弹窗
  hideSpecPopup(e) {
    const { selectedSkuName, cartGoodsNumber } = e.detail;
    this.setData({ specPopupVisible: false });
    if (selectedSkuName) this.setData({ selectedSkuName });
    if (cartGoodsNumber) this.setData({ cartGoodsNumber });
  },

  share() {
    checkLogin(async () => {
      const { promoterInfo, goodsInfo } = this.data;
      const { cover, name, introduction, couponList, price, isGift } =
        goodsInfo;

      const scene = promoterInfo.id
        ? `${this.goodsId}-${promoterInfo.id}`
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

  checkEvaluationDetail() {
    const { avgScore } = this.data.evaluationSummary;
    const url = `./subpages/evaluation-list/index?goodsId=${this.goodsId}&avgScore=${avgScore}`;
    wx.navigateTo({ url });
  },

  CS() {
    // todo 微信客服
    const { cover, name } = this.data.goodsInfo;
    wx.openCustomerServiceChat({
      extInfo: {
        url: ""
      },
      showMessageCard: true,
      sendMessageTitle: name,
      sendMessageImg: cover,
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    });
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
