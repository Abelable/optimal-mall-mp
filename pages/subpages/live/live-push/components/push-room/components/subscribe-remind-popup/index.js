import tim from "../../../../../../../../../../utils/tim/index";
import { MSG_TYPE_SUBSCRIBE_REMIND } from "../../../../../utils/msgType";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    groupId: String,
  },

  methods: {
    pushRemind() {
      tim.sendLiveCustomMsg(this.properties.groupId, {
        type: MSG_TYPE_SUBSCRIBE_REMIND,
      });
      wx.showToast({
        title: "推送成功",
        icon: "none",
      });
      this.hide();
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
