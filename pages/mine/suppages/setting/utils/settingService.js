import BaseService from '../../../../../services/baseService'
import { cleanObject } from '../../../../../utils/index'

class SettingService extends BaseService {
  async updateUserInfo(userInfo, success) {
    return await this.post({ 
      url: `${this.baseUrl}/user/update`, 
      data: cleanObject(userInfo),
      success
    })
  }
}

export default SettingService
