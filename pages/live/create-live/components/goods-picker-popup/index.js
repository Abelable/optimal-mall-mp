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
    goodsList: [],
    allChecked: false
  },

  methods: {
    loadMore() {
      this.setGoodsList();
    },

    async setGoodsList(init = false) {
      if (init) this.page = 0;
      const { list = [] } =
        (await liveService.getUserGoodsList(++this.page)) || {};
      const goodsList = list.map((item) => ({ ...item, checked: false }));
      this.setData({
        goodsList: init ? goodsList : [...this.data.goodsList, ...goodsList],
      });
    },

    toggleChecked(e) {
      const { index } = e.currentTarget.dataset;
      this.setData({
        [`goodsList[${index}].checked`]: !this.data.goodsList[+index].checked,
      });
      this.setData({
        allChecked: this.data.goodsList.findIndex(item => !item.checked) === -1
      })
    },

    toggleAllChecked() {
      const { goodsList: list, allChecked } = this.data
      const goodsList = list.map(item => ({ ...item, checked: !allChecked }))
      this.setData({
        goodsList,
        allChecked: !allChecked
      })
    },

    confirm() {
      const goodsIds = this.data.goodsList
        .filter((item) => item.checked)
        .map((item) => item.id);
      this.triggerEvent("confirm", goodsIds);
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
