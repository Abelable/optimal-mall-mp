import LiveService from "../../../utils/liveService";

const liveService = new LiveService();

Component({
  properties: {
    anchorId: Number,
  },

  methods: {
    subscribe() {
      liveService.subscribeAnchor(anchorId, () => {
        this.triggerEvent('hide')
        wx.showToast({
          title: "订阅成功",
          icon: "none",
        });
      });
    },
  },
});
