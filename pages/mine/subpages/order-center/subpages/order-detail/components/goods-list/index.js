Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array,
    status: Number
  },
  
  methods: {
    navToGoodsDetail(e) {
      const { id } = e.currentTarget.dataset
      const url = `/pages/home/subpages/goods-detailindex?id=${id}`
      wx.navigateTo({ url })
    },

    afterSale(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/subpages/mine/order-center/subpages/goods-order-list/subpages/detail/index?id=${id}`
      wx.navigateTo({ url })
    },
  }
})
