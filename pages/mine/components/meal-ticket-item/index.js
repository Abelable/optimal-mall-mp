Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    restaurantName: String,
    ticketInfo: {
      type: Object,
      observer({
        buyLimit,
        perTableUsageLimit,
        overlayUsageLimit,
        useTimeList,
        inapplicableProducts,
        boxAvailable,
        needPreBook,
      }) {
        const limitTipList = [];
        if (buyLimit) {
          limitTipList.push(`每人每日限购${buyLimit}张`);
        }
        if (perTableUsageLimit) {
          limitTipList.push(`每桌限用${buyLimit}张`);
        }
        if (overlayUsageLimit) {
          limitTipList.push(`单次可用${buyLimit}张`);
        }

        const usageTipsList = [];
        if (useTimeList.length) {
          usageTipsList.push("部分时段可用");
        }
        if (overlayUsageLimit) {
          usageTipsList.push(`单次可用${overlayUsageLimit}张`);
        } else {
          usageTipsList.push("不限张数");
        }
        if (inapplicableProducts.length) {
          usageTipsList.push("部分商品可用");
        } else {
          usageTipsList.push("全场通用");
        }
        if (boxAvailable) {
          usageTipsList.push("可用于包间消费");
        }
        if (needPreBook) {
          usageTipsList.push("需预约");
        }

        this.setData({
          limitTips: limitTipList.join("，"),
          usageTips: usageTipsList.slice(0, 3).join("｜"),
        });
      },
    },
  },

  data: {
    limitTips: "",
    usageTips: "",
  },
});
