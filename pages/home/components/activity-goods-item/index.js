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

      if (couponList.length) {
        const bottomPrice = couponList.map(
          ({ type, numLimit, priceLimit, denomination }) => {
            switch (type) {
              case 1:
                return Math.round((price - denomination) * 100) / 100;
              case 2:
                return (
                  Math.round(
                    ((price * numLimit - denomination) / numLimit) * 100
                  ) / 100
                );
              case 3:
                return priceLimit <= price
                  ? Math.round((price - denomination) * 100) / 100
                  : 0;
            }
          }
        )[0];
        this.setData({ bottomPrice });
      }

      if (activityInfo) {
        const { status, startTime, endTime } = activityInfo;
  
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
          this.triggerEvent("refresh");
          return;
        }
        this.setData({
          countdown: this.data.countdown - 1
        });
      }, 1000);
    },

    subscribe() {
      const { id, isSubscribed } = this.properties.item.activityInfo;
      if (!isSubscribed) {
        homeService.subscribeActivity(id, () => {
          this.setData({
            ["item.activityInfo.isSubscribed"]: 1
          });
          wx.showToast({
            title: "订阅成功",
            icon: "none"
          });
        });
      }
    },

    async addCart() {
      const cartGoodsNumber = await homeService.addCart(
        this.properties.item.id
      );
      if (cartGoodsNumber) {
        wx.showToast({
          title: "成功添加购物车",
          icon: "none"
        });
        this.triggerEvent("addCartSuccess");
      }
    },

    navToGoodsDetail() {
      wx.navigateTo({
        url: `/pages/home/subpages/goods-detail/index?id=${this.properties.item.id}`
      });
    }
  }
});
