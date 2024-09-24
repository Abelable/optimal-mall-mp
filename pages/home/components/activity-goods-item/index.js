import dayjs from "dayjs";
import HomeService from "../../utils/homeService";

const homeService = new HomeService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  data: {
    countdown: 0,
    bottomPrice: 0
  },

  lifetimes: {
    attached() {
      const { price, couponList, activityInfo } = this.properties.item;
      const { status, startTime, endTime } = activityInfo;

      if (couponList.length) {
        const bottomPrice = couponList.map(
          ({ type, numLimit, priceLimit, denomination }) => {
            switch (type) {
              case 1:
                return Math.floor((price - denomination) * 100) / 100;
              case 2:
                return (
                  Math.floor(
                    ((price * numLimit - denomination) / numLimit) * 100
                  ) / 100
                );
              case 3:
                return priceLimit <= price
                  ? Math.floor((price - denomination) * 100) / 100
                  : 0;
            }
          }
        )[0];
        this.setData({ bottomPrice });
      }

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

    subscribe() {
      homeService.subscribeActivity(this.properties.item.id, () => {
        wx.showToast({
          title: "订阅成功",
          icon: "none"
        });
      });
    },

    navToGoodsDetail() {
      wx.navigateTo({
        url: `/pages/home/subpages/goods-detail/index?id=${this.properties.item.id}`
      });
    }
  }
});
