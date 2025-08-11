import { checkLogin } from "../../../../../../../../utils/index";
import LiveService from "../../../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    roomInfo: {
      type: Object,
      observer(info) {
        if (info) {
          this.setCountDown(new Date(info.noticeTime).getTime());
          this.setFollowStatus();
        }
      },
    },
  },

  data: {
    statusBarHeight,
    countDown: 0,
    isFollow: false,
  },

  detached() {
    clearInterval(this.countDownInterval);
  },

  methods: {
    setCountDown(startTime) {
      const currentTime = new Date().getTime();
      let countDown = (startTime - currentTime) / 1000;
      this.setData({ countDown });
      this.countDownInterval = setInterval(() => {
        if (countDown > 0) {
          --countDown;
          this.setData({ countDown });
        } else clearInterval(this.countDownInterval);
      }, 1000);
    },

    setFollowStatus() {
      checkLogin(async () => {
        const anchorId = this.properties.roomInfo.anchorInfo.id;
        const { isFollow } = await liveService.getFollowStatus(anchorId);
        this.setData({ isFollow });
      });
    },

    follow() {
      checkLogin(() => {
        const anchorId = this.properties.roomInfo.anchorInfo.id;
        liveService.followAuthor(anchorId, () => {
          this.setData({ isFollow: true });
        });
      });
    },

    subscribe() {
      checkLogin(() => {
        const anchorId = this.properties.roomInfo.anchorInfo.id;
        liveService.subscribeAnchor(anchorId, () => {
          wx.showToast({
            title: "预约成功",
            icon: "none",
          });
        });
      });
    },

    share() {
      checkLogin(() => {
        this.triggerEvent("share");
      })
    },

    navToUserCenter() {}
  },
});
