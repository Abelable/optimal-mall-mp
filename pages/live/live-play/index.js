import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
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
    const { id, scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.roomId = +id || decodedSceneList[0];
    this.superiorId = decodedSceneList[1] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await liveService.getUserInfo(this.superiorId);
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    this.setRoomList();

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
      actions: ["setLiveMsgList"]
    });

    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
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
      (await liveService.getRoomList(this.roomId, ++this.page)) || {};
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
      shareCover: cover,
      title,
      anchorInfo: authorInfo,
      noticeTime,
      startTime
    } = roomList[curRoomIdx];

    const scene =
      wx.getStorageSync("token") && store.superiorInfo
        ? `${id}-${store.superiorInfo.id}`
        : `${id}`;
    const page = "pages/subpages/home/media/live/live-play/index";
    const qrCode = await liveService.getQrCode(scene, page);

    this.setData({
      posterModalVisible: true,
      posterInfo: {
        status,
        cover,
        title,
        authorInfo,
        noticeTime,
        startTime,
        qrCode
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
    const { id: superiorId } = store.superiorInfo || {};
    const { roomList, curRoomIdx } = this.data;
    const roomInfo = roomList[curRoomIdx];
    const { id, title, cover: imageUrl } = roomInfo;
    const path = superiorId
      ? `/pages/subpages/home/media/live/live-play/index?id=${id}&superiorId=${superiorId}`
      : `/pages/subpages/home/media/live/live-play/index?id=${id}}`;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { id: superiorId } = store.superiorInfo || {};
    const { roomList, curRoomIdx } = this.data;
    const roomInfo = roomList[curRoomIdx];
    const { id, title, cover: imageUrl } = roomInfo;
    title = `有播直播间：${title}`;
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title, imageUrl };
  }
});
