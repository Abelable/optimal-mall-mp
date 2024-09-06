import dayjs from "dayjs";

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  data: {
    countdown: 0
  },

  lifetimes: {
    attached() {
      const { expirationTime } = this.properties.item;
      const countdown = Math.floor(
        (dayjs(expirationTime).valueOf() - dayjs().valueOf()) / 1000
      );
      this.setData({ countdown });
      this.setCountdown();
    },

    detached() {
      clearInterval(this.countdownInterval);
    }
  },

  methods: {
    setCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.data.countdown === 0) {
          clearInterval(this.countdownInterval);
          return;
        }
        this.setData({
          countdown: this.data.countdown - 1
        });
      }, 1000);
    },

    use() {
      const { goodsId } = this.properties.item;
      const url = `/pages/home/subpages/goods-detail/index?id=${goodsId}`;
      wx.navigateTo({ url });
    }
  }
});
