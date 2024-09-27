Page({
  data: {
    typeList: ["仅退款", "退货退款"],
    type: undefined,
    applyInfo: {}
  },

  async onLoad({ orderId, goodsId }) {},

  selectType(e) {
    const type = Number(e.detail.value);
    this.setData({ type });
  }
});
