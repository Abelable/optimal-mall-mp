import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";
import tim from "../../../../../../utils/tim/index";
import {
  MSG_TYPE_HOT_GOODS,
  MSG_TYPE_LIVE_END,
  MSG_TYPE_SUBSCRIBE_REMIND
} from "../../../utils/msgType";
import LiveService from "../../../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: [
      "userInfo",
      "srcIniting",
      "liveLoading",
      "fullScreen",
      "praiseCount"
    ],
    actions: ["setFullScreen", "exitFullScreen"]
  },

  properties: {
    roomInfo: Object
  },

  data: {
    statusBarHeight,
    isLogin: true,
    isFollow: false,
    hotGoods: null,
    hotGoodsVisible: true,
    manualPraise: false,
    audienceActionTips: "",
    showAudienceActionTips: false,
    liveEnd: false,
    liveDuration: 0
  },

  observers: {
    srcIniting: function (truthy) {
      !truthy &&
        checkLogin(() => {
          this.init();
        }, false);
    }
  },

  lifetimes: {
    attached() {
      this.inited = false;
    },

    detached() {
      store.resetRoomData();
    }
  },

  pageLifetimes: {
    show() {
      !this.inited &&
        checkLogin(() => {
          this.init();
        }, false);
    }
  },

  methods: {
    async init() {
      const { id, groupId } = this.properties.roomInfo;
      const { views, praiseNumber, hotGoods, historyChatMsgList, isFollow } =
        (await liveService.joinRoom(id)) || {};
      store.setAudienceCount(views);
      store.setPraiseCount(praiseNumber);
      store.setLiveMsgList([
        ...historyChatMsgList,
        {
          content:
            "平台依法对直播内容进行24小时巡查，倡导绿色直播，维护网络文明健康。切勿与他人私下交易，非官方活动谨慎参与，避免上当受骗。"
        }
      ]);
      if (hotGoods) {
        this.setData({
          hotGoods
        });
      }
      this.setData({ hotGoods, isFollow });
      getApp().onLiveCustomMsgReceive(this.handleCustomMsg.bind(this));
      tim.joinGroup(groupId);
      this.inited = true;
    },

    joinRoom() {
      const { groupId } = this.properties.roomInfo;
      getApp().globalData.im.joinGroup(groupId);
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
                  message: `${nickname}进入直播间`
                },
                showAudienceActionTips: true
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

          case MSG_TYPE_HOT_GOODS:
            const { hotGoods } = customMsg.data;
            this.setData({ hotGoods });
            break;

          case MSG_TYPE_LIVE_END:
            const { liveDuration } = customMsg.data;
            this.setData({ liveDuration, liveEnd: true });
            break;

          case MSG_TYPE_SUBSCRIBE_REMIND:
            this.triggerEvent("showSubscribeModal");
            break;
        }
      }
    },

    dbTap(e) {
      checkLogin(() => {
        const { timeStamp } = e;
        if (this.lastTimeStamp) {
          if (timeStamp - this.lastTimeStamp < 300) {
            this.praise();
          }
          this.lastTimeStamp = 0;
        } else {
          this.lastTimeStamp = timeStamp;
        }
      }, false);
    },

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

    hideHotGoods() {
      this.setData({ hotGoodsVisible: false });
    },

    showGoodsPopup() {
      this.triggerEvent("showGoodsPopup");
    },

    showInputPopup() {
      checkLogin(() => {
        this.triggerEvent("showInputPopup");
      });
    },

    share() {
      checkLogin(() => {
        this.triggerEvent("share");
      });
    },

    login() {
      wx.navigateTo({ url: "/pages/subpages/common/register/index" });
    }
  }
});
