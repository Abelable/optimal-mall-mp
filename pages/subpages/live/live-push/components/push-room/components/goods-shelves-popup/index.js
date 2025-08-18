import LiveService from "../../../../../utils/liveService";

const liveService = new LiveService();

Component({
  options: {
    addGlobalClass: true
  },

  data: {
    curMenuIdx: 0,
    keywords: "",
    goodsList: [],
    multiple: false,
    allSelected: false
  },

  lifetimes: {
    attached() {
      this.setGoodsList(true);
    }
  },

  methods: {
    selectMenu(e) {
      const curMenuIdx = Number(e.currentTarget.dataset.index);
      this.setData({ curMenuIdx });
      this.setGoodsList(true);
    },

    setKeywords(e) {
      this.setData({
        keywords: e.detail.value
      });
    },

    search() {
      const { keywords } = this.data;
      if (!keywords) {
        return;
      }
      this.setGoodsList(true);
    },

    cancelSearch() {
      this.setData({ keywords: "" });
      this.setGoodsList(true);
    },

    loadMore() {
      if (this.data.curMenuIdx === 1) {
        this.setGoodsList();
      }
    },

    async setGoodsList(init = false) {
      if (init) {
        this.page = 0;
        this.setData({ goodsList: [] });
      }
      const { curMenuIdx, keywords, goodsList } = this.data;
      const res = await liveService.getPushRoomGoodsList(
        curMenuIdx === 0 ? 1 : 0,
        keywords,
        ++this.page
      );
      if (curMenuIdx === 0) {
        this.setData({
          goodsList: res.map(item => ({ ...item, checked: false })),
          allSelected: false
        });
      } else {
        const list = res.list.map(item => ({ ...item, checked: false }));
        this.setData({
          goodsList: init ? list : [...goodsList, ...list],
          allSelected: false
        });
      }
    },

    switchMultiple(e) {
      this.setData({
        multiple: e.detail.value
      });
    },

    toggleAllSelected() {
      const { allSelected, goodsList } = this.data;
      this.setData({
        allSelected: !allSelected,
        goodsList: goodsList.map(item => ({
          ...item,
          checked: !allSelected
        }))
      });
    },

    select(e) {
      const { index } = e.currentTarget.dataset;
      this.setData({
        [`goodsList[${index}].checked`]: !this.data.goodsList[index].checked
      });
      this.setData({
        allSelected: this.data.goodsList.findIndex(item => !item.checked) === -1
      });
    },

    listingSelectedGoods() {
      const selectedGoodsIds = this.data.goodsList
        .filter(item => item.checked)
        .map(item => item.id);
      this.listing(selectedGoodsIds);
    },

    delistingSelectedGoods() {
      const selectedGoodsIds = this.data.goodsList
        .filter(item => item.checked)
        .map(item => item.id);
      this.delisting(selectedGoodsIds);
    },

    listingGoods(e) {
      const { id } = e.currentTarget.dataset;
      this.listing([+id]);
    },

    delistingGoods(e) {
      const { id } = e.currentTarget.dataset;
      this.delisting([+id]);
    },

    listing(goodsIds) {
      if (!goodsIds.length) {
        return;
      }
      liveService.listingGoods(goodsIds, () => {
        this.setGoodsList(true);
      });
    },

    delisting(goodsIds) {
      if (!goodsIds.length) {
        return;
      }
      liveService.delistingGoods(goodsIds, () => {
        this.setGoodsList(true);
      });
    },

    setHot(e) {
      const { id } = e.currentTarget.dataset;
      liveService.setHotGoods(+id, () => {
        this.setGoodsList(true);
      });
    },

    cancelHot(e) {
      const { id, index } = e.currentTarget.dataset;
      liveService.cancelHotGoods(+id, () => {
        this.setData({
          [`goodsList[${index}].isHot`]: false
        });
      });
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
