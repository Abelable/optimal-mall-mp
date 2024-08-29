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
      const { status, startTime, endTime } = this.properties.item.activityInfo;
      if (status === 0) {
        const countdown = Math.floor(
          (dayjs(startTime).valueOf() - dayjs().valueOf()) / 1000
        );
        this.setData({ countdown });
        this.setCountdown();
      } else if (status === 1 && endTime) {
        const countdown = Math.floor(
          (dayjs(endTime).valueOf() - dayjs().valueOf()) / 1000
        );
        this.setData({ countdown });
        this.setCountdown();
      }
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

    navToGoodsDetail() {
      wx.navigateTo({
        url: `/pages/home/subpages/goods-detail/index?id=${this.properties.item.id}`
      });
    }
  }
});
