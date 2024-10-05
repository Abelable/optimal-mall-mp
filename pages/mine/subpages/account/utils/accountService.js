import MineService from "../../../utils/mineService";

class AccountService extends MineService {
  async getCommissionCashInfo() {
    return await this.get({
      url: `${this.baseUrl}/commission/cash`
    });
  }

  async getCommissionOrderList(scene, timeType, page, limit = 10) {
    const { list = [] } = await this.get({
      url: `${this.baseUrl}/order/commission_list`,
      data: { scene, timeType, page, limit },
      loadingTitle: "加载中..."
    });
    return list;
  }

  async getBankCardInfo() {
    return await this.get({
      url: `${this.baseUrl}/bank_card/detail`
    });
  }

  async addBankCard(name, code, bankName, success) {
    return await this.post({
      url: `${this.baseUrl}/bank_card/add`,
      data: { name, code, bankName },
      success
    })
  }

  async editBankCard(name, code, bankName, success) {
    return await this.post({
      url: `${this.baseUrl}/bank_card/edit`,
      data: { name, code, bankName },
      success
    })
  }
}

export default AccountService;
