import OrderService from "../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    shippingInfo: {}
  },

  onLoad({ orderId }) {
    this.orderId = orderId;
    this.setShippingInfo();
  },

  async setShippingInfo() {
    const shippingInfo = await orderService.getShippingInfo(this.orderId);
    this.setData({ shippingInfo });
  }
});
