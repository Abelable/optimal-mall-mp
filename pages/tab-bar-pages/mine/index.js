import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";
import { checkLogin } from "../../../utils/index";
import MineService from "./utils/mineService";
import {
  SCENE_SWITCH_TAB,
  SCENE_REFRESH,
  SCENE_LOADMORE,
} from "../../../utils/emuns/scene";

const mineService = new MineService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"],
  },

  data: {
    statusBarHeight,
    curMenuIndex: 0,
    navBarVisible: false,
    menuFixed: false,
    wrapHeightList: [400, 400, 400, 400],
    videoListTotal: 0,
    videoList: [],
    videoFinished: false,
    noteListTotal: 0,
    noteList: [],
    noteFinished: false,
    collectMediaList: [],
    collectFinished: false,
    likeMediaList: [],
    likeFinished: false,
  },

  lifetimes: {
    attached() {
      this.setNavBarVisibleLimit();
      this.setMenuFixedLimit();
      this.scrollTopArr = [0, 0, 0, 0];
    },
  },

  pageLifetimes: {
    show() {
      store.setTabType("mine");

      const {
        curMenuIndex,
        videoList,
        noteList,
        collectMediaList,
        likeMediaList,
      } = this.data;
      if (
        (curMenuIndex === 0 && !videoList.length) ||
        (curMenuIndex === 1 && !noteList.length) ||
        (curMenuIndex === 2 && !collectMediaList.length) ||
        (curMenuIndex === 3 && !likeMediaList.length)
      ) {
        this.setList(SCENE_SWITCH_TAB);
      }
    },
  },

  methods: {
    switchMenu(e) {
      this.handleMenuChange(Number(e.currentTarget.dataset.index));
    },

    swiperChange(e) {
      this.handleMenuChange(Number(e.detail.current));
    },

    handleMenuChange(index) {
      const { curMenuIndex } = this.data;
      if (curMenuIndex !== index) {
        this.setData({ curMenuIndex: index }, () => {
          this.setList(SCENE_SWITCH_TAB);
        });
        this.scrollTopArr[curMenuIndex] = this.scrollTop || 0;
        wx.pageScrollTo({
          scrollTop: this.scrollTopArr[index] || 0,
          duration: 0,
        });
      }
    },

    onPullDownRefresh() {
      this.setList(SCENE_REFRESH);
      wx.stopPullDownRefresh();
    },

    onReachBottom() {
      this.setList(SCENE_LOADMORE);
    },

    setList(scene) {
      checkLogin(() => {
        const {
          curMenuIndex,
          videoList,
          noteList,
          collectMediaList,
          likeMediaList,
        } = this.data;
        switch (scene) {
          case SCENE_SWITCH_TAB:
            switch (curMenuIndex) {
              case 0:
                if (!videoList.length) this.setVideoList(true);
                break;

              case 1:
                if (!noteList.length) this.setNoteList(true);
                break;

              case 2:
                if (!collectMediaList.length) this.setCollectMediaList(true);
                break;

              case 3:
                if (!likeMediaList.length) this.setLikeMediaList(true);
                break;
            }
            break;

          case SCENE_REFRESH:
            switch (curMenuIndex) {
              case 0:
                this.setVideoList(true);
                break;

              case 1:
                this.setNoteList(true);
                break;

              case 2:
                this.setCollectMediaList(true);
                break;

              case 3:
                this.setLikeMediaList(true);
                break;
            }
            break;

          case SCENE_LOADMORE:
            switch (curMenuIndex) {
              case 0:
                this.setVideoList();
                break;

              case 1:
                this.setNoteList();
                break;

              case 2:
                this.setCollectMediaList();
                break;

              case 3:
                this.setLikeMediaList();
                break;
            }
            break;
        }
      });
    },

    async setVideoList(init = false) {
      const limit = 10;
      const { videoFinished, videoList } = this.data;
      if (init) {
        this.videoPage = 0;
        videoFinished && this.setData({ videoFinished: false });
      }
      const { list = [], total = 0 } =
        (await mineService.getUserVideoList(++this.videoPage, limit)) || {};
      this.setData({
        videoList: init ? list : [...videoList, ...list],
      });
      if (init) {
        this.setData({ videoListTotal: total });
      }
      if (list.length < limit) {
        this.setData({ videoFinished: true });
      }
    },

    async setNoteList(init = false) {
      const limit = 10;
      const { noteFinished, noteList } = this.data;
      if (init) {
        this.notePage = 0;
        noteFinished && this.setData({ noteFinished: false });
      }
      const { list = [], total = 0 } =
        (await mineService.getUserNoteList(++this.notePage, limit)) || {};
      this.setData({
        noteList: init ? list : [...noteList, ...list],
      });
      if (init) {
        this.setData({ noteListTotal: total });
      }
      if (list.length < limit) {
        this.setData({ noteFinished: true });
      }
    },

    async setCollectMediaList(init = false) {
      const limit = 10;
      const { collectFinished, collectMediaList } = this.data;
      if (init) {
        this.collectPage = 0;
        collectFinished && this.setData({ collectFinished: false });
      }
      const list =
        (await mineService.getUserCollectMediaList(
          ++this.collectPage,
          limit
        )) || [];
      this.setData({
        collectMediaList: init ? list : [...collectMediaList, ...list],
      });
      if (list.length < limit) {
        this.setData({ collectFinished: true });
      }
    },

    async setLikeMediaList(init = false) {
      const limit = 10;
      const { likeFinished, likeMediaList } = this.data;
      if (init) {
        this.likePage = 0;
        likeFinished && this.setData({ likeFinished: false });
      }
      const list =
        (await mineService.getUserLikeMediaList(++this.likePage, limit)) || [];
      this.setData({
        likeMediaList: init ? list : [...likeMediaList, ...list],
      });
      if (list.length < limit) {
        this.setData({ likeFinished: true });
      }
    },

    setNavBarVisibleLimit() {
      const query = wx.createSelectorQuery();
      query.select(".name").boundingClientRect();
      query.exec((res) => {
        this.navBarVisibleLimit = res[0].bottom;
      });
    },

    setMenuFixedLimit() {
      const query = wx.createSelectorQuery();
      query.select(".works-menu").boundingClientRect();
      query.exec((res) => {
        this.menuFixedLimit = res[0].top - statusBarHeight - 44;
      });
    },

    setWrapHeight() {
      const { curMenuIndex, wrapHeightList } = this.data;
      const query = wx.createSelectorQuery();
      query.selectAll(".content-wrap").boundingClientRect();
      query.exec((res) => {
        if (res[0][curMenuIndex]) {
          const { height } = res[0][curMenuIndex];
          if (height > wrapHeightList[curMenuIndex]) {
            this.setData({
              [`wrapHeightList[${curMenuIndex}]`]: height,
            });
          }
        }
      });
    },

    onPageScroll(e) {
      if (e.scrollTop >= this.navBarVisibleLimit) {
        !this.data.navBarVisible &&
          this.setData({
            navBarVisible: true,
          });
      } else {
        this.data.navBarVisible &&
          this.setData({
            navBarVisible: false,
          });
      }

      if (e.scrollTop >= this.menuFixedLimit) {
        !this.data.menuFixed &&
          this.setData({
            menuFixed: true,
          });
      } else {
        this.data.menuFixed &&
          this.setData({
            menuFixed: false,
          });
      }

      this.scrollTop = e.scrollTop;
    },

    async navToLive() {
      const statusInfo = await mineService.getRoomStatus();
      if (!statusInfo) {
        wx.navigateTo({
          url: "/pages/subpages/live/create-live/index",
        });
      } else {
        const { status, direction } = statusInfo;
        const url =
          status === 3
            ? "/pages/subpages/live/live-notice/index"
            : `/pages/subpages/live/live-push/${
                direction === 1 ? "vertical" : "horizontal"
              }-screen/index`;
        wx.navigateTo({ url });
      }
    },

    navToVideoCreate() {
      wx.navigateTo({
        url: '/pages/subpages/mine/video-create/index',
      });
    }
  },
});
