import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import LiveService from "../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    roomList: [],
    curRoomIdx: 0,
    inputPopupVisible: false,
    goodsPopupVisible: false,
    posterInfo: null,
    posterModalVisible: false,
    subscribeModalVisible: false
  },

  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
      actions: ["setLiveMsgList"]
    });

    const { id, scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.roomId = +id || decodedSceneList[0];
    this.superiorId = decodedSceneList[1] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.promoterInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await liveService.getSuperiorInfo(this.superiorId);
        store.setPromoterInfo(superiorInfo);
      }
    });

    this.setRoomList();
  },

  onShow() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
  },

  onHide() {
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },

  changeRoom(e) {
    const { current: curRoomIdx } = e.detail;
    this.setCurRoomIdxTimeout && clearTimeout(this.setCurRoomIdxTimeout);
    this.setCurRoomIdxTimeout = setTimeout(() => {
      this.setData({ curRoomIdx });
    }, 500);
    const { roomList } = this.data;
    curRoomIdx > roomList.length - 5 && this.setRoomList();
  },

  async setRoomList() {
    if (!this.page) this.page = 0;
    const { list = [] } =
      (await liveService.getLiveList({ id: this.roomId, page: ++this.page })) ||
      {};
    this.setData({
      roomList: [...this.data.roomList, ...list]
    });
  },

  showInputPopup() {
    this.setData({
      inputPopupVisible: true
    });
  },

  showSubscribeModal() {
    this.setData({
      subscribeModalVisible: true
    });
  },

  async share() {
    const { roomList, curRoomIdx } = this.data;
    const {
      id,
      status,
      cover,
      title,
      anchorInfo: authorInfo,
      noticeTime,
      startTime
    } = roomList[curRoomIdx];

    const scene =
      wx.getStorageSync("token") && store.promoterInfo
        ? `${id}-${store.promoterInfo.id}`
        : `${id}`;
    const page = "pages/subpages/live/live-play/index";
    const qrcode = await liveService.getQRCode(scene, page);

    this.setData({
      posterModalVisible: true,
      posterInfo: {
        status,
        cover,
        title,
        authorInfo,
        noticeTime,
        startTime,
        qrcode
      }
    });
  },

  hideModal() {
    const { inputPopupVisible, subscribeModalVisible, posterModalVisible } =
      this.data;
    inputPopupVisible && this.setData({ inputPopupVisible: false });
    subscribeModalVisible && this.setData({ subscribeModalVisible: false });
    posterModalVisible && this.setData({ posterModalVisible: false });
  },

  showGoodsPopup() {
    this.setData({ goodsPopupVisible: true });
  },

  hideGoodsPopup() {
    this.setData({ goodsPopupVisible: false });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  onShareAppMessage() {
    const { id: superiorId } = store.promoterInfo || {};
    const { roomList, curRoomIdx } = this.data;
    const roomInfo = roomList[curRoomIdx];
    const { id, title, shareCover: imageUrl } = roomInfo;
    const path = superiorId
      ? `/pages/subpages/live/live-play/index?id=${id}&superiorId=${superiorId}`
      : `/pages/subpages/live/live-play/index?id=${id}}`;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { id: superiorId } = store.promoterInfo || {};
    const { roomList, curRoomIdx } = this.data;
    const roomInfo = roomList[curRoomIdx];
    const { id, title, shareCover: imageUrl } = roomInfo;
    title = `诚信星球直播间：${title}`;
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title, imageUrl };
  }
});
