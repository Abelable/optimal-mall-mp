Component({
  options: {
    addGlobalClass: true
  },
  
  properties: {
    shopInfo: Object
  },

  methods: {
    navToShop() {
      const id = this.properties.shopInfo.id
      const url = `/pages/subpages/mall/goods/subpages/shop/index?id=${id}`
      wx.navigateTo({ url })
    },

    navToGoodsDetail(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}`
      wx.navigateTo({ url })
    }
  }
})
