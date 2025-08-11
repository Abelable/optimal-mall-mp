import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import LiveService from "../utils/liveService";

const liveService = new LiveService();

Page({
  data: {
    resolutionList: [
      { name: "标清", detail: "480P/1000kbps" },
      { name: "高清", detail: "720P/1500kbps" },
      { name: "超清", detail: "1080P/1800kbps" },
    ],
    curResolutionIdx: 2,
    uploadCoverLoading: false,
    uploadShareCoverLoading: false,
    cover: "",
    shareCover: "",
    direction: 1,
    isMerchant: false,
    goodsPickerPopupVisible: false,
    pickedGoodsIds: [],
    noticeTimeString: "",
    isNotice: false,
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
    });
  },

  onShow() {
    if (this.uploadingCover) {
      this.uploadCover();
    }

    if (this.uploadingShareCover) {
      this.uploadShareCover();
    }
  },

  cropCover() {
    this.uploadingCover = true;
    wx.navigateTo({
      url: "/pages/subpages/common/cropper/index?height=300",
    });
  },

  cropShareCover() {
    this.uploadingShareCover = true;
    wx.navigateTo({
      url: "/pages/subpages/common/cropper/index",
    });
  },

  async uploadCover() {
    if (!this.data.uploadCoverLoading) {
      this.setData({ uploadCoverLoading: true });
      if (store.croppedImagePath) {
        const cover = await liveService.uploadFile(store.croppedImagePath);
        this.setData({ cover });
        store.setCroppedImagePath("");
        this.uploadingCover = false
      }
      this.setData({ uploadCoverLoading: false });
    }
  },

  async uploadShareCover() {
    if (!this.data.uploadShareCoverLoading) {
      this.setData({ uploadShareCoverLoading: true });
      if (store.croppedImagePath) {
        const shareCover = await liveService.uploadFile(store.croppedImagePath);
        this.setData({ shareCover });
        store.setCroppedImagePath("");
        this.uploadingShareCover = false;
      }
      this.setData({ uploadShareCoverLoading: false });
    }
  },

  selectResolution(e) {
    this.setData({
      curResolutionIdx: Number(e.currentTarget.dataset.index),
    });
  },

  setTitle(e) {
    this.title = e.detail.value;
  },

  selectDirection(e) {
    this.setData({
      direction: Number(e.currentTarget.dataset.direction),
    });
  },

  showGoodsPickerPopup() {
    this.setData({
      goodsPickerPopupVisible: true,
    });
  },

  setGoodsIds(e) {
    this.setData({
      pickedGoodsIds: e.detail,
      goodsPickerPopupVisible: false,
    });
  },

  hideGoodsPickerPopup() {
    this.setData({
      goodsPickerPopupVisible: false,
    });
  },

  toggleIsNotice(e) {
    this.setData({
      isNotice: e.detail.value,
    });
  },

  setNoticeTime(e) {
    const { date, dateString } = e.detail;
    this.noticeTime = new Date(date).toISOString();
    this.setData({
      noticeTimeString: dateString.slice(0, -3),
    });
  },

  async startLive() {
    const {
      cover,
      shareCover,
      curResolutionIdx,
      direction,
      pickedGoodsIds,
      isNotice,
    } = this.data;

    if (!cover) {
      wx.showToast({ title: "请上传列表封面", icon: "none" });
      return;
    }
    if (!shareCover) {
      wx.showToast({ title: "请上传分享封面", icon: "none" });
      return;
    }
    if (!this.title) {
      wx.showToast({ title: "请输入直播标题", icon: "none" });
      return;
    }
    if (isNotice && !this.noticeTime) {
      wx.showToast({ title: "请设置预告时间", icon: "none" });
      return;
    }

    const roomInfo = {
      title: this.title,
      cover,
      shareCover,
      direction,
      goodsIds: pickedGoodsIds,
      noticeTime: this.noticeTime,
    };

    store.setDefinitionIndex(curResolutionIdx);
    liveService.createLive(roomInfo, () => {
      const url = isNotice
        ? "../live-notice/index"
        : `../live-push/${
            direction === 1 ? "vertical" : "horizontal"
          }-screen/index`;
      wx.navigateTo({ url });
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
