import dayjs from "dayjs";
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import OrderService from "../../utils/orderService";

const orderService = new OrderService();

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"]
  },

  properties: {
    item: Object,
    index: Number
  },

  data: {
    countdown: 0,
    refundBtnVisible: false
  },

  lifetimes: {
    attached() {
      const { status, createdAt, payTime, goodsList } = this.properties.item;
      if (status === 101) {
        const countdown = Math.floor(
          (dayjs(createdAt).valueOf() +
            24 * 60 * 60 * 1000 -
            dayjs().valueOf()) /
            1000
        );
        this.setData({ countdown });
        this.setCountdown();
      }

      if (status === 201 || status === 302) {
        const giftGoodsIdx = goodsList.findIndex(item => item.isGift);
        if (
          giftGoodsIdx === -1 &&
          dayjs().diff(dayjs(payTime), "minute") <= 30
        ) {
          this.setData({ refundBtnVisible: true });
        }
      }
    },

    detached() {
      clearInterval(this.countdownInterval);
    }
  },

  methods: {
    setCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.data.countdown <= 0) {
          clearInterval(this.countdownInterval);
          this.cancelOrder();
          return;
        }
        this.setData({
          countdown: this.data.countdown - 1
        });
      }, 1000);
    },

    async payOrder() {
      const { item, index } = this.properties;
      const params = await orderService.getPayParams([item.id]);
      wx.requestPayment({
        ...params,
        success: () => {
          this.triggerEvent("update", { type: "pay", index });
        }
      });
    },

    refundOrder() {
      wx.showModal({
        title: "确定申请退款吗？",
        success: result => {
          if (result.confirm) {
            const { item, index } = this.properties;
            orderService.refundOrder(item.id, () => {
              this.setData({ refundBtnVisible: false });
              this.triggerEvent("update", { type: "refund", index });
            });
          }
        }
      });
    },

    confirmOrder() {
      wx.showModal({
        title: "确认收到货了吗？",
        success: result => {
          if (result.confirm) {
            const { item, index } = this.properties;
            orderService.confirmOrder(item.id, () => {
              this.triggerEvent("update", { type: "confirm", index });
            });
          }
        }
      });
    },

    deleteOrder() {
      wx.showModal({
        title: "确定删除该订单吗？",
        success: result => {
          if (result.confirm) {
            const { item, index } = this.properties;
            orderService.deleteOrder([item.id], () => {
              this.triggerEvent("update", { type: "delete", index });
            });
          }
        }
      });
    },

    confirmOrderCancel() {
      wx.showModal({
        title: "确定取消该订单吗？",
        success: result => {
          if (result.confirm) {
            this.cancelOrder();
          }
        }
      });
    },

    cancelOrder() {
      const { item, index } = this.properties;
      orderService.cancelOrder(item.id, () => {
        this.triggerEvent("update", { type: "cancel", index });
      });
    },

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/mine/subpages/order-center/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    navToEvaluation() {
      const { id, goodsList } = this.properties.item;
      const url = `/pages/mine/subpages/order-center/subpages/evaluation/index?orderId=${id}&goodsList=${JSON.stringify(
        goodsList
      )}`;
      wx.navigateTo({ url });
    }
  }
});
