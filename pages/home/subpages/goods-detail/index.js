import dayjs from "dayjs";
import { getQueryString, checkLogin } from "../../../../utils/index";
import HomeService from "../../utils/homeService";

const homeService = new HomeService();
const { statusBarHeight } = getApp().globalData.systemInfo;
const navBarHeight = statusBarHeight + 44;

Page({
  data: {
    statusBarHeight,
    // 导航栏相关
    showNavBar: false, // 导航栏显隐
    detailActive: false, // 导航栏'详情'激活状态
    // 轮播图相关
    curDot: 1,
    muted: true,
    goodsInfo: null,
    countdown: 0,
    bottomPrice: 0,
    evaluationSummary: null,
    cartGoodsNumber: 0,
    // 规格相关
    selectedSpecDesc: "",
    specPopupVisible: false,
    actionMode: 0,
    posterInfo: null,
    posterModelVisible: false
  },

  async onLoad({ id, scene, q }) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    const decodedScene = scene ? decodeURIComponent(scene) : "";
    const decodedQ = q ? decodeURIComponent(q) : "";
    this.goodsId =
      id || decodedScene.split("-")[0] || getQueryString(decodedQ, "id");

    await this.setGoodsInfo();
    this.getBannerHeight();
  },

  onShow() {
    checkLogin(() => {
      this.setCartGoodsNumber();
    }, false);
  },

  async setGoodsInfo() {
    const goodsInfo = await homeService.getGoodsInfo(this.goodsId);
    const evaluationSummary = await homeService.getGoodsEvaluationSummary(
      this.goodsId
    );
    this.setData({ goodsInfo, evaluationSummary }, () => {
      this.getDetailTop();
    });

    this.setBottomPrice();

    if (goodsInfo.activityInfo) {
      const { status, startTime, endTime } = goodsInfo.activityInfo;
      if (status === 0) {
        const countdown = Math.floor(
          (dayjs(startTime).valueOf() - dayjs().valueOf()) / 1000
        );
        this.setData({ countdown });
        this.setCountdown();
      } else if (status === 1 && endTime) {
        const countdown = Math.floor(
          (dayjs(endTime).valueOf() - dayjs().valueOf()) / 1000
        );
        this.setData({ countdown });
        this.setCountdown();
      }
    }
  },

  setBottomPrice() {
    const { price, couponList } = this.data.goodsInfo
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
  getDetailTop() {
    const query = wx.createSelectorQuery();
    query.select(".goods-detail-line").boundingClientRect();
    query.exec(res => {
      if (res[0] !== null) {
        this.detailTop = res[0].top;
      }
    });
  },

  // 监听滚动
  onPageScroll(e) {
    const { showNavBar, detailActive } = this.data;

    // 控制导航栏显隐
    if (e.scrollTop >= this.bannerHeight) {
      if (!showNavBar) {
        this.setData({ showNavBar: true });
      }
    } else {
      if (showNavBar) {
        this.setData({ showNavBar: false });
      }
    }

    // 控制导航栏tab的状态切换
    if (e.scrollTop >= this.detailTop - navBarHeight) {
      if (!detailActive) this.setData({ detailActive: true });
    } else {
      if (detailActive) this.setData({ detailActive: false });
    }
  },

  // 滚动到顶部
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },

  // 滚动到详情部分
  scrollToDetail() {
    wx.pageScrollTo({
      scrollTop: this.detailTop - navBarHeight * 0.9
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
      const { mode } = e.currentTarget.dataset;
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
      const scene = `id=${this.goodsId}`;
      const page = "pages/tab-bar-pages/home/index";
      const qrcode = await homeService.getQRCode(scene, page);

      const {
        cover,
        name: title,
        price,
        marketPrice,
        salesVolume
      } = this.data.goodsInfo;

      this.setData({
        posterModalVisible: true,
        posterInfo: { cover, title, price, marketPrice, salesVolume, qrcode }
      });
    });
  },

  hidePosterModal() {
    this.setData({
      posterModalVisible: false
    });
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
  },

  // 分享
  onShareAppMessage() {
    const { id, name: title, cover: imageUrl } = this.data.goodsInfo;
    const path = `/pages/home/subpages/goods-detail/index?id=${id}`;
    return { title, imageUrl, path };
  },

  onShareTimeline() {
    const { id, name, image: imageUrl } = this.data.goodsInfo;
    const title = `诚信星球商品：${name}`;
    const query = `id=${id}`;
    return { query, title, imageUrl };
  }
});
