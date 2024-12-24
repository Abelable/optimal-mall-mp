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
    pathOptions: [],
    curOptionIdx: 0,
    bancCardInfo: null,
    remark: "",
    authModalVisible: false,
    btnActive: false
  },

  onLoad(options) {
    const scene = Number(options.scene);
    const amount = Number(options.amount);
    const taxFee = scene === 2 ? amount * 0.06 : 0;
    const actualAmount = amount - taxFee - 1;
    this.setData({
      scene,
      amount,
      taxFee,
      actualAmount: actualAmount < 0 ? 0 : actualAmount,
      pathOptions:
        actualAmount >= 500
          ? [{ cn: "银行卡", en: "card", value: 2 }]
          : [
              { cn: "微信", en: "wx", value: 1 },
              { cn: "银行卡", en: "card", value: 2 }
            ]
    });

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
    if (!this.data.btnActive) {
      return;
    }
    if (store.userInfo.authInfoId) {
      const {
        scene,
        amount: withdrawAmount,
        pathOptions,
        curOptionIdx,
        remark
      } = this.data;
      const path = pathOptions[curOptionIdx].value;
      accountService.applyWithdraw(
        { scene, withdrawAmount, path, remark },
        () => {
          wx.navigateTo({
            url: "./subpages/withdraw-result/index"
          });
        }
      );
    } else {
      this.setData({ authModalVisible: true });
    }
  },

  hideAuthModal() {
    this.setData({ authModalVisible: false });
  }
});
