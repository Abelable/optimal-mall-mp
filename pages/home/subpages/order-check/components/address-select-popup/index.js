import HomeService from '../../../../utils/homeService'

const homeService = new HomeService()

Component({
  options: {
    addGlobalClass: true
  },
  
  properties: {
    addressId: Number,
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          this.setAddressList()
        }
      }
    }
  },

  pageLifetimes: {
    show() {
      this.setAddressList()
    }
  },

  data: {
    addressList: [],
    selectedIndex: 0,
  },
  
  methods: {
    async setAddressList() {
      const addressList = await homeService.getAddressList()
      this.setData({ addressList })
      
      const { addressId } = this.properties
      if (addressId) {
        const selectedIndex = addressList.findIndex(item => (item.id === addressId))
        this.setData({ selectedIndex })
      }
    },

    selectAddress(e) {
      this.setData({ 
        selectedIndex: Number(e.detail.value)
      })
    },

    confirm() {
      const { addressList, selectedIndex } = this.data
      this.triggerEvent('hide', addressList[selectedIndex].id)
    },

    hide() {
      this.triggerEvent('hide')
    },

    navToAddressListPage() {
      wx.navigateTo({
        url: '/pages/mine/subpages/address-list/index'
      })
    }
  }
})
