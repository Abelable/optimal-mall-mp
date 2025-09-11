import LiveService from "../../../utils/liveService";

const liveService = new LiveService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy && !this.data.goodsList.length) {
          this.setGoodsList(true);
        }
      }
    }
  },

  data: {
    keywords: "",
    goodsList: [],
    allChecked: false
  },

  methods: {
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
      this.setGoodsList();
    },

    async setGoodsList(init = false) {
      if (init) this.page = 0;
      const { keywords, goodsList } = this.data;

      let list = [];
      if (keywords) {
        list =
          (await liveService.searchGoodsList({
            keywords,
            page: ++this.page
          })) || [];
      } else {
        list = (await liveService.getGoodsList({ page: ++this.page })) || [];
      }

      const processedList = list.map(item => ({
        ...item,
        checked: (this.pickedGoodsIds || []).includes(item.id)
      }));
      this.setData({
        goodsList: init ? processedList : [...goodsList, ...processedList]
      });
    },

    toggleChecked(e) {
      const { goodsList } = this.data;
      const { index } = e.currentTarget.dataset;
      const { id, checked } = goodsList[index];
      this.setData({
        [`goodsList[${index}].checked`]: !checked,
        allChecked: goodsList.findIndex(item => !item.checked) === -1
      });

      if (!this.pickedGoodsIds) {
        this.pickedGoodsIds = [];
      }
      const idIdx = this.pickedGoodsIds.findIndex(item => item === id);
      if (idIdx !== -1) {
        this.pickedGoodsIds.splice(idIdx, 1);
      } else {
        this.pickedGoodsIds.push(id);
      }
    },

    toggleAllChecked() {
      const { goodsList: list, allChecked } = this.data;
      const goodsList = list.map(item => ({ ...item, checked: !allChecked }));
      this.setData({
        goodsList,
        allChecked: !allChecked
      });
      this.pickedGoodsIds = goodsList
        .filter(item => item.checked)
        .map(item => item.id);
    },

    confirm() {
      this.triggerEvent("confirm", this.pickedGoodsIds || []);
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
