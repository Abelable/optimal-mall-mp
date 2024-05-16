import GoodsService from "../../../../utils/goodsService";

const goodsService = new GoodsService();

Page({
  data: {
    evaluationList: [],
    finished: false,
  },

  onLoad({ goodsId, avgScore }) {
    wx.setNavigationBarTitle({
      title: +avgScore ? `商品评分 ${avgScore}` : '商品评价',
    });
    this.goodsId = goodsId;

    this.setEvaluationList(true)
  },

  onPullDownRefresh() {
    this.setEvaluationList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setEvaluationList();
  },

  async setEvaluationList(init = false) {
    if (init) {
      this.page = 0;
    }
    const { list = [] } =
      (await goodsService.getGoodsEvaluationList(this.goodsId, ++this.page)) ||
      {};
    this.setData({
      evaluationList: init ? list : [...this.data.evaluationList, ...list],
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },
});
