Page({
  data: {
    curMenuIdx: 0,
    dateList: ["今日", "昨日", "本月", "上月", "全部"],
    curDateIdx: 0
  },

  selectMenu(e) {
    const curMenuIdx = e.currentTarget.dataset.index;
    this.setData({ curMenuIdx });
  },

  selectDate(e) {
    const curDateIdx = e.currentTarget.dataset.index;
    this.setData({ curDateIdx });
  },
});
