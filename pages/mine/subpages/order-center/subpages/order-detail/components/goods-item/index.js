const dayjs = require("dayjs")

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    status: Number,
    confirmTime: String
  },

  data: {
    refundBtnVisible: false
  },

  lifetimes: {
    attached() {
      const { status, confirmTime, item } = this.properties
      if ([401, 402, 403, 501].includes(status) && item.refundStatus === 1 && dayjs(confirmTime).diff(dayjs().valueOf(), 'day') <= 7) {
        this.setData({ refundBtnVisible: true })
      }
    }
  },
  
  methods: {
    navToGoodsDetail(e) {
      const { id } = e.currentTarget.dataset
      const url = `/pages/home/subpages/goods-detail/index?id=${id}`
      wx.navigateTo({ url })
    },

    applyRefund(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/subpages/mine/order-center/subpages/goods-order-list/subpages/detail/index?id=${id}`
      wx.navigateTo({ url })
    },
  }
})
