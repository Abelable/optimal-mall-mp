import { getQueryString, checkLogin } from "../../../../../../utils/index";
import GoodsService from "../../utils/goodsService";

const goodsService = new GoodsService();
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
    goodsInfo: null,
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
    const goodsInfo = await goodsService.getGoodsInfo(this.goodsId);
    const evaluationSummary = await goodsService.getGoodsEvaluationSummary(
      this.goodsId
    );
    this.setData({ goodsInfo, evaluationSummary }, () => {
      this.getDetailTop();
    });
  },

  async setCartGoodsNumber() {
    const cartGoodsNumber = await goodsService.getCartGoodsNumber();
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
      if (!showNavBar) this.setData({ showNavBar: true });
    } else {
      if (showNavBar) this.setData({ showNavBar: false });
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
    const { selecteSkuName, cartGoodsNumber } = e.detail;
    this.setData({ specPopupVisible: false });
    if (selecteSkuName) this.setData({ selecteSkuName });
    if (cartGoodsNumber) this.setData({ cartGoodsNumber });
  },

  share() {
    checkLogin(async () => {
      const scene = `id=${this.goodsId}`;
      const page = "pages/tab-bar-pages/home/index";
      const qrcode = await goodsService.getQRCode(scene, page);

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

  // 分享
  onShareAppMessage() {
    const { id, name: title, cover: imageUrl } = this.data.goodsInfo;
    const path = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}`;
    return { title, imageUrl, path };
  },

  onShareTimeline() {
    const { id, name, image: imageUrl } = this.data.goodsInfo;
    const title = `小鱼游商品：${name}`;
    const query = `id=${id}`;
    return { query, title, imageUrl };
  }
});
