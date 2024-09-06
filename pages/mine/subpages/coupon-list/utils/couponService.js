import BaseService from '../../../../../services/baseService'

class CouponService extends BaseService {
  async getCouponList() {
    return await this.get({ 
      url: `${this.baseUrl}/address/detail`, 
      data: { id },
      loadingTitle: '加载中...'
    })
  }
}

export default CouponService
