Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    couponId: Number,
    list: {
      type: Array,
      observer(list) {
        if (list.length) {
          const couponList = [
            { id: 0, name: "不使用优惠券", denomination: 0 },
            ...list
          ];
          this.setData({ couponList });
        }
      }
    },
    show: Boolean
  },

  data: {
    selectedIndex: 1
  },

  methods: {
    selectCoupon(e) {
      this.setData({
        selectedIndex: Number(e.detail.value)
      });
    },

    confirm() {
      const { couponList, selectedIndex } = this.data;
      const { id } = couponList[selectedIndex];
      this.triggerEvent("confirm", { id });
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
