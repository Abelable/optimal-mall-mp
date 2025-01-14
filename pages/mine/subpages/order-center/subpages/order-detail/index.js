import dayjs from "dayjs";
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";
import OrderService from "../../utils/orderService";

const plugin = requirePlugin("logisticsPlugin");
const orderService = new OrderService();

Page({
  data: {
    orderInfo: null,
    countdown: 0,
    refundBtnVisible: false,
    addressPopupVisible: false
  },

  onLoad({ id }) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"]
    });

    this.orderId = id;
  },

  onShow() {
    checkLogin(() => {
      this.setOrderInfo();
    });
  },

  async setOrderInfo() {
    const orderInfo = await orderService.getOrderDetail(this.orderId);
    this.setData({ orderInfo });

    const { status, createdAt, payTime, goodsList } = orderInfo;
    if (status === 101) {
      const countdown = Math.floor(
        (dayjs(createdAt).valueOf() + 24 * 60 * 60 * 1000 - dayjs().valueOf()) /
          1000
      );
      this.setData({ countdown });
      this.setCountdown();
    }

    if (status === 201) {
      const giftGoodsIdx = goodsList.findIndex(item => item.isGift);
      if (giftGoodsIdx === -1 && dayjs().diff(dayjs(payTime), "minute") <= 30) {
        this.setData({ refundBtnVisible: true });
      }
    }

    const titleEnums = {
      101: "等待买家付款",
      102: "交易关闭",
      103: "交易关闭",
      104: "交易关闭",
      201: "等待卖家发货",
      204: "等待卖家发货",
      202: "退款申请中",
      203: "退款成功",
      301: "待收货",
      401: "待评价",
      402: "待评价",
      501: "交易完成"
    };
    wx.setNavigationBarTitle({
      title: titleEnums[orderInfo.status]
    });
  },

  setCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.data.countdown === 0) {
        clearInterval(this.countdownInterval);
        return;
      }
      this.setData({
        countdown: this.data.countdown - 1
      });
    }, 1000);
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderSn,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  },

  async payOrder() {
    const params = await orderService.getPayParams([this.orderId]);
    wx.requestPayment({
      ...params,
      success: () => {
        this.setData({
          ["orderInfo.status"]: 201
        });
      }
    });
  },

  refundOrder() {
    wx.showModal({
      title: "确定申请退款吗？",
      success: result => {
        if (result.confirm) {
          orderService.refundOrder(this.orderId, () => {
            this.setData({
              refundBtnVisible: false,
              ["orderInfo.status"]: 203
            });
          });
        }
      }
    });
  },

  confirmOrder() {
    orderService.confirmOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 401
      });
    });
  },

  deleteOrder() {
    wx.showModal({
      title: "确定删除订单吗？",
      success: result => {
        if (result.confirm) {
          orderService.deleteOrder([this.orderId], () => {
            wx.navigateBack();
          });
        }
      }
    });
  },

  cancelOrder() {
    wx.showModal({
      title: "确定取消订单吗？",
      success: result => {
        if (result.confirm) {
          orderService.cancelOrder(this.orderId, () => {
            this.setData({
              ["orderInfo.status"]: 102
            });
          });
        }
      }
    });
  },

  async checkShippingInfo() {
    const waybillToken = await orderService.getWaybillToken(this.orderId);
    plugin.openWaybillTracking({ waybillToken });
  },

  navToEvaluation() {
    const { id, goodsList } = this.data.orderInfo;
    const url = `../evaluation/index?orderId=${id}&goodsList=${JSON.stringify(
      goodsList
    )}`;
    wx.navigateTo({ url });
  },

  showAddressPopup() {
    this.setData({
      addressPopupVisible: true
    });
  },

  confirmAddressSelect(e) {
    this.addressId = e.detail.id;
    this.modifyAddressInfo();
    this.hideAddressPopup();
  },

  hideAddressPopup() {
    this.setData({
      addressPopupVisible: false
    });
  },

  async modifyAddressInfo() {
    const { consignee, mobile, address } =
      (await orderService.modifyOrderAddressInfo(
        this.data.orderInfo.id,
        this.addressId
      )) || {};
    if (consignee)
      this.setData({
        ["orderInfo.consignee"]: consignee,
        ["orderInfo.mobile"]: mobile,
        ["orderInfo.address"]: address
      });
  },

  onUnload() {
    clearInterval(this.countdownInterval);
    this.storeBindings.destroyStoreBindings();
  }
});
