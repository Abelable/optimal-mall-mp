Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    restaurantName: String,
    info: {
      type: Object,
      observer({
        price,
        originalPrice,
        useTimeList,
        buyLimit,
        perTableUsageLimit,
        needPreBook,
      }) {
        const discount = parseFloat(((price / originalPrice) * 10).toFixed(1));

        const tips = [];
        if (useTimeList.length) {
          tips.push("部分时段可用");
        } else {
          tips.push("营业时间可用");
        }
        if (buyLimit) {
          tips.push(`限购${buyLimit}张`);
        }
        if (perTableUsageLimit) {
          tips.push(`每桌限用${buyLimit}张`);
        }
        if (needPreBook) {
          tips.push("需预约");
        } else {
          tips.push("免预约");
        }

        this.setData({ discount, tips: tips.slice(0, 3).join("｜") });
      },
    },
  },

  data: {
    discount: 0,
    tips: "",
  },

  methods: {
    checkDetail() {
      this.triggerEvent("checkDetail", this.properties.info.setMealId);
    },
  },
});
