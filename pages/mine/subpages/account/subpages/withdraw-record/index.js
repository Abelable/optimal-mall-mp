Page({
  data: {
    recordList: [],
    // recordList: [
    //   {
    //     status: 2,
    //     amount: "420.00",
    //     commission: "180",
    //     time: "2021-03-10 14:33:48"
    //   },
    //   {
    //     status: 1,
    //     amount: "420.00",
    //     commission: "180",
    //     time: "2021-03-10 14:33:48"
    //   },
    //   {
    //     status: 0,
    //     amount: "420.00",
    //     commission: "180",
    //     time: "2021-03-10 14:33:48"
    //   }
    // ],
    finished: false
  },

  onLoad() {
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
  },
});
