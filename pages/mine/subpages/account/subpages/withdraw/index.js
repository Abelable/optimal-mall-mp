import { store } from "../../../../../../store/index";
import AccountService from "../../utils/accountService";

const accountService = new AccountService();

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    scene: 1,
    amount: 0,
    taxFee: 0,
    actualAmount: 0,
    pathOptions: [
      { cn: "余额（立即到账）", en: "balance", value: 3 },
      { cn: "银行卡（预计1-3个工作日到账）", en: "card", value: 2 }
    ],
    curOptionIdx: 0,
    bancCardInfo: null,
    remark: "",
    authModalVisible: false,
    btnActive: false
  },

  onLoad(options) {
    const scene = Number(options.scene);
    const amount = Number(options.amount);
    const taxFee =
      scene === 2 || scene === 3 ? Math.floor(amount * 0.06 * 100) / 100 : 0;
    const actualAmount = amount - taxFee - 1;
    this.setData({
      scene,
      amount,
      taxFee,
      actualAmount: actualAmount < 0 ? 0 : actualAmount
    });
    // this.setData({
    //   scene,
    //   amount,
    //   taxFee,
    //   actualAmount: actualAmount < 0 ? 0 : actualAmount,
    //   pathOptions:
    //     actualAmount >= 500
    //       ? [{ cn: "银行卡（预计1-3个工作日到账）", en: "card", value: 2 }]
    //       : [
    //           { cn: "微信（预计1-3个工作日到账）", en: "wx", value: 1 },
    //           { cn: "银行卡（预计1-3个工作日到账）", en: "card", value: 2 }
    //         ]
    // });

    const date = new Date().getDate();
    if (date >= 25 && amount > 1) {
      this.setData({ btnActive: true });
    }
  },

  onShow() {
    this.setBankCardInfo();
  },

  selectOption(e) {
    const curOptionIdx = e.currentTarget.dataset.index;
    this.setData({ curOptionIdx });
  },

  async setBankCardInfo() {
    const bancCardInfo = await accountService.getBankCardInfo();
    if (bancCardInfo) {
      const { code, ...rest } = bancCardInfo;
      this.setData({
        bancCardInfo: {
          code: `${code.slice(0, 5)}****${code.slice(-5)}`,
          ...rest
        }
      });
    }
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: true });
      }
    } else {
      if (this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: false });
      }
    }
  },

  bindBank() {
    wx.navigateTo({
      url: "./subpages/bind-bank/index"
    });
  },

  setRemark(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  withdraw() {
    const {
      btnActive,
      scene,
      amount: withdrawAmount,
      pathOptions,
      curOptionIdx,
      remark,
      bancCardInfo
    } = this.data;

    if (!btnActive) {
      return;
    }

    if (!store.userInfo.authInfoId) {
      this.setData({ authModalVisible: true });
      return;
    }

    const path = pathOptions[curOptionIdx].value;
    if (path === 2 && !bancCardInfo) {
      wx.showToast({
        title: "尚未绑定银行卡账号",
        icon: "none"
      });
      return;
    }

    accountService.applyWithdraw(
      { scene, withdrawAmount, path, remark },
      () => {
        if (path === 3) {
          this.setData({ amount: 0 });
          wx.showToast({
            title: "提现成功",
            icon: "none"
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        } else {
          wx.navigateTo({
            url: "./subpages/withdraw-result/index"
          });
        }
      }
    );
  },

  hideAuthModal() {
    this.setData({ authModalVisible: false });
  }
});
