import MineService from "../../../utils/mineService";

class AccountService extends MineService {
  async getAccountInfo() {
    return await this.get({
      url: `${this.baseUrl}/account/info`,
    })
  }

  async getTransactionRecordList(accountId, page, limit = 10) {
    const { list = [] } = await this.get({
      url: `${this.baseUrl}/account/transaction_record_list`,
      data: { accountId, page, limit },
      loadingTitle: "加载中..."
    });
    return list;
  }
}

export default AccountService;
