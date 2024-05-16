import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { customBack } from "../../../../utils/index";
import BaseService from "../../../../services/baseService";

const baseService = new BaseService();

Page({
  data: {
    historyKeywords: [],
    hotKeywords: [],
    keywords: "",
    isSearching: false,
    tabScroll: 0,
    curMenuIdx: 0,
    mediaList: [],
    mediaFinished: false,
    videoList: [],
    videoFinished: false,
    noteList: [],
    noteFinished: false,
    liveList: [],
    liveFinished: false,
    scenicList: [],
    scenicFinished: false,
    hotelList: [],
    hotelFinished: false,
    calendarPopupVisibel: false,
    restaurantList: [],
    restaurantFinished: false,
    goodsList: [],
    goodsFinished: false,
    userList: [],
    userFinished: false
  },

  onLoad({ scene = 0 }) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["checkInDate", "checkOutDate"]
    });

    this.setData({ curMenuIdx: Number(scene) });
    this.initCalendar();
    this.setHistoryKeywords();
    this.setHotKeywords();
  },

  setKeywords(e) {
    this.setData({
      keywords: e.detail.value
    });
  },

  selectKeywords(e) {
    const { keywords } = e.currentTarget.dataset;
    this.setData({ keywords });
    this.search();
  },

  search() {
    const { keywords } = this.data;
    if (!keywords) {
      return;
    }
    baseService.saveKeywords(keywords);
    this.setList(true);
    this.setData({ isSearching: true });
  },

  cancelSearch() {
    this.setHistoryKeywords();
    this.setData({
      keywords: "",
      isSearching: false,
      mediaList: [],
      mediaFinished: false,
      videoList: [],
      videoFinished: false,
      noteList: [],
      noteFinished: false,
      liveList: [],
      liveFinished: false,
      scenicList: [],
      scenicFinished: false,
      hotelList: [],
      hotelFinished: false,
      restaurantList: [],
      restaurantFinished: false,
      goodsList: [],
      goodsFinished: false,
      userList: [],
      userFinished: false
    });
  },

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    const tabScroll = (curMenuIdx - 2) * 80;
    this.setData({ curMenuIdx, tabScroll });
  },

  onReachBottom() {
    this.setList();
  },

  onPullDownRefresh() {
    this.setList(true);
    wx.stopPullDownRefresh();
  },

  setList(init = false) {
    switch (this.data.curMenuIdx) {
      case 0:
        if (init) {
          this.setVideoList(true);
          this.setNoteList(true);
          this.setLiveList(true);
          this.setScenicList(true);
          this.setHotelList(true);
          this.setRestaurantList(true);
          this.setGoodsList(true);
          this.setUserList(true);
        }
        this.setMediaList(init);
        break;
      case 1:
        this.setVideoList(init);
        break;
      case 2:
        this.setNoteList(init);
        break;
      case 3:
        this.setLiveList(init);
        break;
      case 4:
        this.setScenicList(init);
        break;
      case 5:
        this.setHotelList(init);
        break;
      case 6:
        this.setRestaurantList(init);
        break;
      case 7:
        this.setGoodsList(init);
        break;
      case 8:
        this.setUserList(init);
        break;
    }
  },

  async setMediaList(init = false) {
    const limit = 10;
    if (init) {
      this.mediaPage = 0;
      this.setData({ mediaFinished: false });
    }
    const { keywords, mediaList } = this.data;
    const { list = [] } =
      (await baseService.searchMediaList(keywords, ++this.mediaPage, limit)) ||
      {};
    this.setData({
      mediaList: init ? list : [...mediaList, ...list]
    });
    if (list.length < limit) {
      this.setData({ mediaFinished: true });
    }
  },

  async setVideoList(init = false) {
    const limit = 10;
    if (init) {
      this.videoPage = 0;
      this.setData({ videoFinished: false });
    }
    const { keywords, videoList } = this.data;
    const { list = [] } =
      (await baseService.searchVideoList(keywords, ++this.videoPage, limit)) ||
      {};
    this.setData({
      videoList: init ? list : [...videoList, ...list]
    });
    if (list.length < limit) {
      this.setData({ videoFinished: true });
    }
  },

  async setNoteList(init = false) {
    const limit = 10;
    if (init) {
      this.notePage = 0;
      this.setData({ noteFinished: false });
    }
    const { keywords, noteList } = this.data;
    const { list = [] } =
      (await baseService.searchNoteList(keywords, ++this.notePage, limit)) ||
      {};
    this.setData({
      noteList: init ? list : [...noteList, ...list]
    });
    if (list.length < limit) {
      this.setData({ noteFinished: true });
    }
  },

  async setLiveList(init = false) {
    const limit = 10;
    if (init) {
      this.livePage = 0;
      this.setData({ liveFinished: false });
    }
    const { keywords, liveList } = this.data;
    const { list = [] } =
      (await baseService.searchLiveRoomList(
        keywords,
        ++this.livePage,
        limit
      )) || {};
    this.setData({
      liveList: init ? list : [...liveList, ...list]
    });
    if (list.length < limit) {
      this.setData({ liveFinished: true });
    }
  },

  async setScenicList(init = false) {
    const limit = 10;
    if (init) {
      this.scenicPage = 0;
      this.setData({ scenicFinished: false });
    }
    const { keywords, scenicList } = this.data;
    const { list = [] } =
      (await baseService.searchScenicList(
        keywords,
        ++this.scenicPage,
        limit
      )) || {};
    this.setData({
      scenicList: init ? list : [...scenicList, ...list]
    });
    if (list.length < limit) {
      this.setData({ scenicFinished: true });
    }
  },

  async setHotelList(init = false) {
    const limit = 10;
    if (init) {
      this.hotelPage = 0;
      this.setData({ hotelFinished: false });
    }
    const { keywords, hotelList } = this.data;
    const { list = [] } =
      (await baseService.searchHotelList(keywords, ++this.hotelPage, limit)) ||
      {};
    this.setData({
      hotelList: init ? list : [...hotelList, ...list]
    });
    if (list.length < limit) {
      this.setData({ hotelFinished: true });
    }
  },

  async setRestaurantList(init = false) {
    const limit = 10;
    if (init) {
      this.restaurantPage = 0;
      this.setData({ restaurantFinished: false });
    }
    const { keywords, restaurantList } = this.data;
    const { list = [] } =
      (await baseService.searchRestaurantList(
        keywords,
        ++this.restaurantPage,
        limit
      )) || {};
    this.setData({
      restaurantList: init ? list : [...restaurantList, ...list]
    });
    if (list.length < limit) {
      this.setData({ restaurantFinished: true });
    }
  },

  async setGoodsList(init = false) {
    const limit = 10;
    if (init) {
      this.goodsPage = 0;
      this.setData({ goodsFinished: false });
    }
    const { keywords, goodsList } = this.data;
    const list =
      (await baseService.searchGoodsList({
        keywords,
        page: ++this.goodsPage,
        limit
      })) || [];
    this.setData({
      goodsList: init ? list : [...goodsList, ...list]
    });
    if (list.length < limit) {
      this.setData({ goodsFinished: true });
    }
  },

  async setUserList(init = false) {
    const limit = 10;
    if (init) {
      this.userPage = 0;
      this.setData({ userFinished: false });
    }
    const { keywords, userList } = this.data;
    const list =
      (await baseService.searchUserList({
        keywords,
        page: ++this.userPage,
        limit
      })) || [];
    this.setData({
      userList: init ? list : [...userList, ...list]
    });
    if (list.length < limit) {
      this.setData({ userFinished: true });
    }
  },

  async setHistoryKeywords() {
    const historyKeywords = await baseService.getHistoryKeywords();
    this.setData({ historyKeywords });
  },

  async setHotKeywords() {
    const hotKeywords = await baseService.getHotKeywords();
    this.setData({ hotKeywords });
  },

  clearHistoryKeywords() {
    wx.showModal({
      content: "确定清空历史搜索记录吗？",
      showCancel: true,
      success: result => {
        if (result.confirm) {
          this.setData({
            historyKeywords: []
          });
          baseService.clearHistoryKeywords();
        }
      }
    });
  },

  showCalendarPopup() {
    this.setData({
      calendarPopupVisibel: true
    });
  },

  hideCalendarPopup() {
    this.setData({
      calendarPopupVisibel: false
    });
  },

  initCalendar() {
    store.setCheckInDate(new Date().getTime());

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    store.setCheckOutDate(endDate.getTime());
  },

  setCalendar(e) {
    const [start, end] = e.detail;
    store.setCheckInDate(start.getTime());
    store.setCheckOutDate(end.getTime());
    this.setData({
      calendarPopupVisibel: false
    });
  },

  navBack() {
    customBack();
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
