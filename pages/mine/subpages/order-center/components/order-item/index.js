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
    fields: ["teamLeaderInfo"]
  },

  properties: {
    item: Object,
    index: Number
  },

  methods: {
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
      const { item, index } = this.properties;
      orderService.refundOrder(item.id, () => {
        this.triggerEvent("update", { type: "refund", index });
      });
    },

    confirmOrder() {
      const { item, index } = this.properties;
      orderService.confirmOrder(item.id, () => {
        this.triggerEvent("update", { type: "confirm", index });
      });
    },

    deleteOrder() {
      const { item, index } = this.properties;
      orderService.deleteOrder(item.id, () => {
        this.triggerEvent("update", { type: "delete", index });
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

    navToShipping() {
      const { id } = this.properties.item;
      const url = `/pages/mine/subpages/order-center/subpages/shipping/index?id=${id}`;
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
