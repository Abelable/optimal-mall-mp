import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../../store/index";
import tim from "../../../../../../../../utils/tim/index";
import LiveService from "../../../utils/liveService";
import { MSG_TYPE_JOIN_ROOM, MSG_TYPE_PRAISE } from "../../../utils/msgType";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"],
  },

  properties: {
    roomInfo: Object,
  },

  data: {
    statusBarHeight,
    countdownVisible: false,
    start: false,
    stop: false,
    liveEnd: false, // 直播结束
    hotGoods: null,
    hotGoodsVisible: true,
    manualPraise: false, // 是否是手动点赞
    audienceActionTips: "", // 观众行为（进直播间、下单...）
    showAudienceActionTips: false, // 控制观众行为弹幕的显示隐藏
    inputPopupVisible: false,
    posterModalVisible: false,
    moreFeaturesPopupVisible: false,
    beautyPopupVisible: false,
    hdPopupVisible: false,
    subscribeRemindPopupVisible: false,
    goodsShelvesPopupVisible: false,
  },

  observers: {
    roomInfo: function (info) {
      if (info) {
        const { status, viewersNumber, praiseNumber, historyChatMsgList } =
          info;

        if (status === 1) {
          this.startLive();
          store.setAudienceCount(viewersNumber);
          store.setPraiseCount(praiseNumber);
          store.setLiveMsgList([
            ...historyChatMsgList,
            {
              content:
                "平台依法对直播内容进行24小时巡查，倡导绿色直播，维护网络文明健康。切勿与他人私下交易，非官方活动谨慎参与，避免上当受骗。",
            },
          ]);
        }
      }
    },
  },

  lifetimes: {
    attached() {
      getApp().onLiveCustomMsgReceive(this.handleCustomMsg.bind(this));
    },
  },

  methods: {
    startCountdown() {
      this.setData({
        countdownVisible: true,
      });
      setTimeout(() => {
        this.setData({
          countdownVisible: false,
        });
        this.startLive();
      }, 5000);
    },

    async startLive() {
      const { status, groupId } = this.properties.roomInfo;
      status !== 1 && liveService.startLive();
      this.setRecommendGoods();
      tim.joinGroup(groupId);
      this.setData({ start: true });
    },

    reverseCamera() {
      store.setRemoteMirror(store.devicePosition === "front" ? false : true);
      store.setDevicePosition(
        store.devicePosition === "front" ? "back" : "front"
      );
      store.setLocalMirror("auto");
    },

    shopInputPopup() {
      this.setData({
        inputPopupVisible: true,
      });
    },

    showSubscribeRemindPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        subscribeRemindPopupVisible: true,
      });
    },

    showMoreFeaturesPopup() {
      this.setData({
        moreFeaturesPopupVisible: true,
      });
    },

    showBeautyPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        beautyPopupVisible: true,
      });
    },

    showHdPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        hdPopupVisible: true,
      });
    },

    showGoodsShelvesPopup() {
      this.setData({
        goodsShelvesPopupVisible: true,
      });
    },

    showTrafficRechargePopup() {
      this.setData({
        trafficRechargePopupVisible: true,
      });
    },

    async share() {
      const {
        id,
        status,
        shareCover: cover,
        title,
        anchorInfo: authorInfo,
        noticeTime,
        startTime
      } = this.properties.roomInfo;
  
      const scene = `id=${id}`;
      const page = "pages/tab-bar-pages/home/index";
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
      const {
        inputPopupVisible,
        posterModalVisible,
        moreFeaturesPopupVisible,
        beautyPopupVisible,
        hdPopupVisible,
        subscribeRemindPopupVisible,
        goodsShelvesPopupVisible,
      } = this.data;
      if (inputPopupVisible) this.setData({ inputPopupVisible: false });
      if (posterModalVisible) this.setData({ posterModalVisible: false });
      if (moreFeaturesPopupVisible)
        this.setData({ moreFeaturesPopupVisible: false });
      if (beautyPopupVisible) this.setData({ beautyPopupVisible: false });
      if (hdPopupVisible) this.setData({ hdPopupVisible: false });
      if (subscribeRemindPopupVisible)
        this.setData({ subscribeRemindPopupVisible: false });
      if (goodsShelvesPopupVisible)
        this.setData({ goodsShelvesPopupVisible: false });
    },

    confirmStopLive() {
      if (this.data.start) {
        wx.showModal({
          content: "确定结束直播吗？",
          showCancel: true,
          success: (result) => {
            if (result.confirm) {
              this.setData({ stop: true });
              store.setAudienceCount(0);
              store.setPraiseCount(0);
              liveService.stopLive(() => {
                wx.switchTab({ url: "/pages/tab-bar-pages/mine/index" });
              });
            }
          },
        });
      } else {
        wx.switchTab({ url: "/pages/tab-bar-pages/mine/index" });
      }
    },

    // 点赞
    praise() {
      wx.vibrateShort({ type: "heavy" });
      if (!this.data.manualPraise) this.setData({ manualPraise: true });

      let praiseCount = store.praiseCount;
      store.setPraiseCount(++praiseCount);
      if (!this.praiseCount) this.praiseCount = 0;
      ++this.praiseCount;
      if (!this.savePraiseInterval) {
        this.savePraiseInterval = setInterval(() => {
          if (this.praiseCount) {
            liveService.savePraiseCount(
              this.properties.roomInfo.id,
              this.praiseCount
            );
            this.praiseCount = 0;
          } else {
            clearInterval(this.savePraiseInterval);
            this.savePraiseInterval = null;
          }
        }, 5000);
      }
    },

    handleCustomMsg(customMsg) {
      if (customMsg) {
        const { manualPraise, showAudienceActionTips } = this.data;

        switch (customMsg.type) {
          case MSG_TYPE_JOIN_ROOM:
            if (!showAudienceActionTips) {
              const { nickname } = customMsg.data;
              this.setData({
                audienceActionTips: {
                  type: "coming",
                  message: `${nickname}进入直播间`,
                },
                showAudienceActionTips: true,
              });
              setTimeout(() => {
                this.setData({ showAudienceActionTips: false });
              }, 2000);
            }
            let audienceCount = store.audienceCount;
            store.setAudienceCount(++audienceCount);
            break;

          case MSG_TYPE_PRAISE:
            const { praiseNumber } = customMsg.data;
            if (praiseNumber > store.praiseCount) {
              manualPraise && this.setData({ manualPraise: false });
              store.setPraiseCount(praiseNumber);
            }
            break;
        }
      }
    },

    async setRecommendGoods() {},
  },
});
