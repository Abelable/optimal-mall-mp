import { debounce } from '../../../../../../utils/index'
import AddressService from '../../utils/addressService'

const addressService = new AddressService()

Page({
  data: {
    addressInfo: null,
  },

  onLoad({ id }) {
    this.addressId = id
    this.setAddressInfo()
  },

  async setAddressInfo() {
    const addressInfo = await addressService.getAddressInfo(this.addressId)
    this.setData({ addressInfo })
  },

  setName: debounce(function(e) {
    this.setData({
      ['addressInfo.name']: e.detail.value
    })
  }, 500),

  setMobile: debounce(function(e) {
    this.setData({
      ['addressInfo.mobile']: e.detail.value
    })
  }, 500),

  selectRegion(e) {
    const { code, value } = e.detail
    this.setData({
      addressInfo: {
        ...this.data.addressInfo,
        regionCodeList: code,
        regionDesc: Array.from(new Set(value)).join(' ')
      }
    })
  },

  setAddressDetail: debounce(function(e) {
    this.setData({
      ['addressInfo.addressDetail']: e.detail.value
    })
  }),

  toggleDefaultValue(e) {
    this.setData({
      ['addressInfo.isDefault']: e.detail.value ? 1 : 0
    })
  },

  save() {
    const { name, mobile, regionCodeList, addressDetail } = this.data.addressInfo
    if (!name) {
      wx.showToast({ 
        title: '请输入姓名', 
        icon: 'none' 
      })
      return
    }
    if (!mobile || !/^1[345789][0-9]{9}$/.test(mobile)) {
      wx.showToast({ 
        title: '请输入正确手机号', 
        icon: 'none' 
      })
      return
    }
    if (!regionCodeList) {
      wx.showToast({ 
        title: '请选择省市区', 
        icon: 'none' 
      })
      return
    }
    if (!addressDetail) {
      wx.showToast({ 
        title: '请输入详细地址', 
        icon: 'none' 
      })
      return
    }

    addressService.editAddress(
      { 
        ...this.data.addressInfo, 
        regionCodeList: JSON.stringify(regionCodeList) 
      },
      () => {
        wx.navigateBack()
      }
    )
  },

  delete() {
    wx.showModal({
      title: '提示',
      content: '确定删除该收货地址吗？',
      showCancel: true,
      success: async res => {
        if (res.confirm) {
          addressService.deleteAddress(
            this.addressId,
            () => {
              wx.navigateBack()
            }
          )
        }
      }
    })
  }
})
