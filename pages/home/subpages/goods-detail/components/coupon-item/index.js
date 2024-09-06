import dayjs from "dayjs";
import HomeService from "../../../../utils/homeService";

const homeService = new HomeService();

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

    receive() {
      const { id, isReceived, receivedNum } = this.properties.item;
      if (isReceived) {
        this.triggerEvent("showSpecPopup");
      } else {
        homeService.receiveCoupon(id, () => {
          this.setData({
            ["item.isReceived"]: 1,
            ["item.receivedNum"]: receivedNum + 1
          });
        });
      }
    }
  }
});
