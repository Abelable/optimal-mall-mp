import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";
import { checkLogin } from "../../../utils/index";
import MineService from "./utils/mineService";
import {
  SCENE_SWITCH_TAB,
  SCENE_REFRESH,
  SCENE_LOADMORE,
} from "../../../utils/emuns/listScene";

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
    },
  },

  pageLifetimes: {
    show() {
      store.setTabType("mine");

      checkLogin(() => {
        this.scrollTopArr = [0, 0, 0, 0];
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0,
        });
        this.updateUserInfo();
        this.setList(SCENE_REFRESH);
      });
    },
  },

  methods: {
    updateUserInfo() {
      mineService.getUserInfo();
    },

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
    },

    async setVideoList(init = false) {
      if (init) {
        this.videoPage = 0;
        this.setData({ videoFinished: false });
      }
      const { videoFinished, videoList } = this.data;

      if (!videoFinished) {
        const { list = [], total = 0 } =
          (await mineService.getUserVideoList({
            page: ++this.videoPage,
            loadingTitle: "加载中...",
          })) || {};
        this.setData({
          videoList: init ? list : [...videoList, ...list],
        });
        if (init) {
          this.setData({ videoListTotal: total });
        }
        if (!list.length) {
          this.setData({ videoFinished: true });
        }
      }
    },

    async setNoteList(init = false) {
      if (init) {
        this.notePage = 0;
        this.setData({ noteFinished: false });
      }
      const { noteFinished, noteList } = this.data;

      if (!noteFinished) {
        const { list = [], total = 0 } =
          (await mineService.getUserNoteList({ page: ++this.notePage })) || {};
        this.setData({
          noteList: init ? list : [...noteList, ...list],
        });
        if (init) {
          this.setData({ noteListTotal: total });
        }
        if (!list.length) {
          this.setData({ noteFinished: true });
        }
      }
    },

    async setCollectMediaList(init = false) {
      if (init) {
        this.collectPage = 0;
        this.setData({ collectFinished: false });
      }
      const { collectFinished, collectMediaList } = this.data;

      if (!collectFinished) {
        const { list = [] } =
          (await mineService.getUserCollectMediaList(++this.collectPage)) || {};
        this.setData({
          collectMediaList: init ? list : [...collectMediaList, ...list],
        });
        if (!list.length) {
          this.setData({ collectFinished: true });
        }
      }
    },

    async setLikeMediaList(init = false) {
      if (init) {
        this.likePage = 0;
        this.setData({ likeFinished: false });
      }
      const { likeFinished, likeMediaList } = this.data;

      if (!likeFinished) {
        const { list = [] } =
          (await mineService.getUserLikeMediaList(++this.likePage)) || {};
        this.setData({
          likeMediaList: init ? list : [...likeMediaList, ...list],
        });
        if (!list.length) {
          this.setData({ likeFinished: true });
        }
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
      const { curMenuIndex } = this.data;
      const query = wx.createSelectorQuery();
      query.selectAll(".content-wrap").boundingClientRect();
      query.exec((res) => {
        if (res[0][curMenuIndex]) {
          const { height } = res[0][curMenuIndex];
          this.setData({
            [`wrapHeightList[${curMenuIndex}]`]: height < 400 ? 400 : height,
          });
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

    navToSetting() {
      wx.navigateTo({
        url: "/pages/subpages/mine/setting/index",
      });
    },

    async navToLive() {
      const {
        userInfoId,
        merchantId,
        scenicProviderId,
        hotelProviderId,
        cateringProviderId,
      } = store.userInfo;
      if (
        !userInfoId &&
        !merchantId &&
        !scenicProviderId &&
        !hotelProviderId &&
        !cateringProviderId
      ) {
        wx.showModal({
          title: "温馨提示",
          content: "直播需要认证您的真实身份，请先完成实名认证",
          showCancel: false,
          confirmText: "确定",
          success: (result) => {
            if (result.confirm) {
              const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/auth`;
              wx.navigateTo({ url });
            }
          },
        });
        return;
      }

      const statusInfo = await mineService.getRoomStatus();
      if (!statusInfo) {
        wx.navigateTo({
          url: "/pages/subpages/home/media/live/create-live/index",
        });
      } else {
        const { status, direction } = statusInfo;
        const url =
          status === 3
            ? "/pages/subpages/home/media/live/live-notice/index"
            : `/pages/subpages/home/media/live/live-push/${
                direction === 1 ? "vertical" : "horizontal"
              }-screen/index`;
        wx.navigateTo({ url });
      }
    },

    async navToVideoCreate() {
      const { tempFilePath } = (await mineService.chooseVideo()) || {};
      if (tempFilePath) {
        const url = `/pages/subpages/mine/create-video/index?tempFilePath=${tempFilePath}`;
        wx.navigateTo({ url });
      }
    },

    navToNoteCreate() {
      const url = "/pages/subpages/mine/create-note/index";
      wx.navigateTo({ url });
    },

    navToUserInfoSetting() {
      const url =
        "/pages/subpages/mine/setting/subpages/user-info-setting/index";
      wx.navigateTo({ url });
    },

    checkFollowList() {
      const url = "/pages/subpages/mine/fan-follow-list/index?scene=1";
      wx.navigateTo({ url });
    },

    checkFanList() {
      const url = "/pages/subpages/mine/fan-follow-list/index?scene=2";
      wx.navigateTo({ url });
    },

    navToMessageCenter() {
      wx.navigateTo({
        url: "/pages/subpages/message-center/index",
      });
    },
  },
});
