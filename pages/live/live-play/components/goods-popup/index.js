import LiveService from "../../../utils/liveService";

const liveService = new LiveService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    roomId: Number,
  },

  data: {
    total: 0,
    goodsList: [],
    finished: false,
  },

  lifetimes: {
    attached() {
      this.setGoodsList(true);
    },
  },

  methods: {
    loadMore() {
      this.setGoodsList();
    },

    async setGoodsList(init = false) {
      const { roomId, goodsList } = this.data;
      if (init) {
        this.page = 0;
      }
      const { list = [], total = 0 } =
        (await liveService.getRoomGoodsList(roomId, ++this.page)) || {};
      if (init) {
        this.setData({ total });
      }
      this.setData({
        goodsList: init ? list : [...goodsList, ...list],
      });
    },

    navToGoodsDetail(e) {
      const { id } = e.currentTarget.dataset;
      const url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
