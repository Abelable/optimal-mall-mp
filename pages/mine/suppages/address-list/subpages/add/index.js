import AddressService from '../../utils/addressService'

const addressService = new AddressService()

Page({
  data: {
    regionDesc: ''
  },

  setName(e) {
    this.name = e.detail.value
  },

  setMobile(e) {
    this.mobile = e.detail.value
  },

  selectRegion(e) {
    const { code, value } = e.detail
    this.regionCodeList = code
    const regionDesc = Array.from(new Set(value)).join(' ')
    this.setData({ regionDesc })
  },

  setAddressDetail(e) {
    this.addressDetail = e.detail.value
  },

  toggleDefaultValue(e) {
    this.isDefault = e.detail.value ? 1 : 0
  },

  save() {
    if (!this.name) {
      wx.showToast({ 
        title: '请输入姓名', 
        icon: 'none' 
      })
      return
    }
    if (!this.mobile || !/^1[345789][0-9]{9}$/.test(this.mobile)) {
      wx.showToast({ 
        title: '请输入正确手机号', 
        icon: 'none' 
      })
      return
    }
    if (!this.regionCodeList) {
      wx.showToast({ 
        title: '请选择省市区', 
        icon: 'none' 
      })
      return
    }
    if (!this.addressDetail) {
      wx.showToast({ 
        title: '请输入详细地址', 
        icon: 'none' 
      })
      return
    }

    addressService.addAddress(
      this.name, 
      this.mobile, 
      JSON.stringify(this.regionCodeList), 
      this.data.regionDesc, 
      this.addressDetail, 
      this.isDefault,
      () => {
        wx.navigateBack()
      }
    )
  }
})
