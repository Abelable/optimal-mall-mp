import { WEBVIEW_BASE_URL } from "../../../../../../config";
import AccountService from "../../utils/accountService";

const accountService = new AccountService();

Component({
  properties: {
    show: Boolean,
    amount: Number
  },

  data: {
    agree: false
  },

  methods: {
    exchange() {
      const { amount, agree } = this.data;

      if (amount === 0) {
        return;
      }

      if (!agree) {
        wx.showToast({
          title: "请阅读并同意积分兑换协议",
          icon: "none"
        });
        return;
      }

      accountService.applyExchangePoint(amount, () => {
        wx.showToast({
          title: "退换成功",
          icon: "none"
        });
        setTimeout(() => {
          this.triggerEvent("success");
        }, 2000);
      });
    },

    toggleAgree() {
      this.setData({
        agree: !this.data.agree
      });
    },

    checkService() {
      wx.navigateTo({
        url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/agreements/point_service`
      });
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
