import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";
import LiveService from "../../../utils/liveService";

const liveService = new LiveService();

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["activeMediaItem", "userInfo"],
  },

  properties: {
    item: Object,
  },

  data: {
    visible: false,
    active: false,
    activeBgVisible: false,
  },

  observers: {
    activeMediaItem: function (info) {
      if (info) {
        const { id, top } = info;
        const { active } = this.data;
        if (id == this.properties.item.id) {
          const query = this.createSelectorQuery();
          query.select(".live-item").boundingClientRect();
          query.exec((res) => {
            if (res[0].top === top) this.setData({ active: true });
            else if (active)
              this.setData({ active: false, activeBgVisible: false });
          });
        } else if (active)
          this.setData({ active: false, activeBgVisible: false });
      }
    },
  },

  methods: {
    onCoverLoaded() {
      this.setData({ visible: true });
    },

    statechange(e) {
      if (e.detail.code == 2004) {
        setTimeout(() => {
          this.setData({ activeBgVisible: true });
        }, 200);
      }
    },

    subscribe() {
      const { id } = this.properties.item.anchorInfo;
      if (id !== store.userInfo.id) {
        checkLogin(() => {
          liveService.subscribeAnchor(id, () => {
            wx.showToast({
              title: "预约成功",
              icon: "none",
            });
          });
        });
      }
    },

    navToLiveDetail() {
      const { id, anchorInfo, status, direction } = this.properties.item;
      let url;
      if (anchorInfo.id === store.userInfo.id) {
        url =
          status === 3
            ? "/pages/subpages/live/live-notice/index"
            : `/pages/subpages/live/live-push/${
                direction === 1 ? "vertical" : "horizontal"
              }-screen/index`;
      } else {
        url = `/pages/subpages/live/live-play/index?id=${id}`;
      }
      wx.navigateTo({ url });
    },
  },
});
