import CouponService from "./utils/couponService";

const couponService = new CouponService();

Page({
  data: {
    menuList: [
      { name: "未使用", status: 1 },
      { name: "已使用", status: 2 },
      { name: "已过期", status: 3 }
    ],
    curMenuIdx: 0,
    couponList: [],
    finished: false
  },

  onLoad() {
    this.setCouponList(true);
  },

  selectMenu(e) {
    const curMenuIdx = e.currentTarget.dataset.index;
    this.setData({ curMenuIdx });
    this.setCouponList(true);
  },

  onPullDownRefresh() {
    this.setCouponList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setCouponList();
  },

  async setCouponList(init) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    const { menuList, curMenuIdx, couponList } = this.data;
    const list = await couponService.getCouponList(
      menuList[curMenuIdx].status,
      ++this.page
    );
    this.setData({ couponList: init ? list : [...couponList, ...list] });
    if (!list.length) {
      this.setData({ finished: true });
    }
  }
});
