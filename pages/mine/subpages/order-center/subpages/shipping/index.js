import { expressOptions } from "../../../../../../utils/index";
import OrderService from "../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    expressOptions,
    shipChannel: "",
    shipSn: "",
    traces: []
  },

  onLoad({ shipCode, shipSn, mobile }) {
    const shipChannel = expressOptions.find(item => item.value === shipCode).name;
    this.setData({ shipChannel, shipSn });
    this.setShippingInfo(shipCode, shipSn, mobile);
  },

  async setShippingInfo(shipCode, shipSn, mobile) {
    const traces = await orderService.getShippingInfo(shipCode, shipSn, mobile);
    this.setData({ traces });
  }
});
