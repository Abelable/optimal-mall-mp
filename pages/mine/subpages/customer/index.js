Page({
  data: {
    curMenuIdx: 0,
    keywords: "",
    searching: false
  },

  onLoad(options) {
    const type = +options.type;
    if (type !== 0) {
      this.setData({ curMenuIdx: type - 1 });
    }
  },

  selectMenu(e) {},

  setKeywords(e) {
    this.setData({
      keywords: e.detail.value
    });
  },

  search() {
    this.setData({ searching: true });
  },

  clearSearch() {
    this.setData({ searching: false });
  }
});
