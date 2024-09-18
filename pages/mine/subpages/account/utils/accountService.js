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
}

export default AccountService;
