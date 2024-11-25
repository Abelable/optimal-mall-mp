import AccountService from "../../utils/accountService";

const accountService = new AccountService();

Page({
  data: {
    recordList: [],
    finished: false
  },

  onLoad() {
    this.setRecordList(true);
  },

  onPullDownRefresh() {
    this.setRecordList();
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setRecordList(true);
  },

  async setRecordList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    const list = await accountService.getWithdrawRecordList(++this.page);
    this.setData({
      recordList: init ? list : [...this.data.recordList, ...list]
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  }
});
