import AddressService from './utils/addressService'

const addressService = new AddressService

Page({
  data: {
    addressList: []
  },

  onShow() {
    this.setAddressList()
  },

  async setAddressList() {
    const addressList = await addressService.getAddressList() || []
    this.setData({ addressList })
  },

  editAddress(e) {
    wx.navigateTo({ 
      url: `./subpages/edit/index?id=${e.currentTarget.dataset.id}`
    })
  },
  
  // 显示新建收货地址
  addAddress() {
    wx.navigateTo({ url: './subpages/add/index'})
  },

  deleteAddress(e) {
    const { id, index } = e.currentTarget.dataset
    const { position, instance } = e.detail
    if (position === 'right') {
      wx.showModal({
        title: '提示',
        content: '确定删除该收货地址吗？',
        showCancel: true,
        success: async res => {
          if (res.confirm) {
            addressService.deleteAddress(id,
              () => {
                const addressList = this.data.addressList
                addressList.splice(index, 1)
                this.setData({ addressList })
                instance.close()
              }
            )
          } else {
            instance.close()
          }
        }
      })
    }
  }
})