import { checkLogin } from '../../../../../../utils/index'
import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()

Component({
  options: {
    addGlobalClass: true
  },
  
  properties: {
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          const { goodsInfo, cartInfo } = this.properties
          if (goodsInfo.specList.length) {
            if (cartInfo) {
              const { selectedSkuName, selectedSkuIndex, number } = cartInfo
              const { name, stock } = goodsInfo.skuList[selectedSkuIndex]
              if (selectedSkuName !== '' && selectedSkuIndex !== -1 && name === selectedSkuName) {
                const specList = goodsInfo.specList.map((item) => ({
                  ...item, 
                  options: item.options.map((_item) => ({
                    name: _item,
                    selected: selectedSkuName.includes(_item)
                  }))
                }))
                this.setData({ 
                  specList,
                  count: number > stock ? stock : number
                }) 
                return
              }
            }

            const specList = goodsInfo.specList.map((item) => ({
              ...item, 
              options: item.options.map((_item, _index) => ({
                name: _item,
                selected: _index === 0
              }))
            }))
            this.setData({ specList })
          }
        }
      }
    },
    mode: {
      type: Number,
      value: 0
    },
    goodsInfo: Object,
    cartInfo: Object,
  },

  data: {
    specList: [],
    selectedSkuName: '',
    selectedSkuIndex: -1,
    count: 1,
    btnActive: false
  },

  observers: {
    'specList': function (list) {
      if (list.length) {
        const selectedSkuName = list.map(item => item.options.find(_item => _item.selected).name).join()
        const selectedSkuIndex = this.data.goodsInfo.skuList.findIndex(item => item.name === selectedSkuName)
        this.setData({ selectedSkuName, selectedSkuIndex })
      } 
    },
    'selectedSkuIndex': function(index) {
      const { goodsInfo } = this.properties
      this.setData({
        btnActive: index !== -1 ? goodsInfo.skuList[index].stock !== 0 : goodsInfo.stock !== 0
      })
    }
  },
  
  methods: {
    // 选择规格
    selectSpec(e) {
      const { index, optionIndex } = e.currentTarget.dataset
      const specList = this.data.specList.map((item, specIndex) => index === specIndex ? ({
        ...item, 
        options: item.options.map((_item, _index) => ({
          ..._item,
          selected: _index === optionIndex
        }))
      }) : item)
      this.setData({ specList })
    },

    countChange({ detail: count }) {
      this.setData({ count })
    },

    // 加入购物车
    addCart() {
      if (this.data.btnActive) {
        checkLogin(async () => {
          const { goodsInfo, selectedSkuIndex, count } = this.data
          const cartGoodsNumber = await goodsService.addCart(goodsInfo.id, selectedSkuIndex, count)
          cartGoodsNumber && this.triggerEvent('hide', { cartGoodsNumber })
        })
      }
    },

    // 立即购买
    buyNow() {
      if (this.data.btnActive) {
        checkLogin(async () => {
          const { goodsInfo, selectedSkuIndex, count } = this.data
          const cartGoodsId = await goodsService.fastAddCart(goodsInfo.id, selectedSkuIndex, count)
          const cartGoodsIds = JSON.stringify([cartGoodsId])
          const url = `/pages/subpages/mall/goods/subpages/order-check/index?cartGoodsIds=${cartGoodsIds}`
          wx.navigateTo({ url })
        })
      }
    },

    editSpec() {
      if (this.data.btnActive) {
        const { cartInfo, selectedSkuIndex, count } = this.data
        goodsService.editCart(cartInfo.id, cartInfo.goodsId, selectedSkuIndex, count, (res) => {
          this.triggerEvent('hide', { cartInfo: res.data })
        })
      }
    },

    hide() {
      const { selectedSkuName } = this.data
      this.triggerEvent('hide', { selectedSkuName })
    }
  }
})
