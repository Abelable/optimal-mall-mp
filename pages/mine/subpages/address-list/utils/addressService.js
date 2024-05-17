import BaseService from '../../../../../services/baseService'

class AddressService extends BaseService {
  async getAddressInfo(id) {
    return await this.get({ 
      url: `${this.baseUrl}/address/detail`, 
      data: { id },
      loadingTitle: '加载中...'
    })
  }

  async addAddress(name, mobile, regionCodeList, regionDesc, addressDetail, isDefault, success) {
    await this.post({ 
      url: `${this.baseUrl}/address/add`, 
      data: { name, mobile, regionCodeList, regionDesc, addressDetail, isDefault },
      success
    })
  }

  async editAddress(addressInfo, success) {
    await this.post({ 
      url: `${this.baseUrl}/address/edit`, 
      data: addressInfo,
      success
    })
  }

  async deleteAddress(id, success) {
    await this.post({
      url: `${this.baseUrl}/address/delete`,
      data: { id }, 
      success
    })
  }
}

export default AddressService
