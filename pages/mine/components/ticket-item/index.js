Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    ticketInfo: {
      type: Object,
      observer({ validityTime, selectedDateTimestamp: timeStamp }) {
        const startDate = new Date(timeStamp * 1000);
        const startYear = startDate.getFullYear();
        const startMonth = `${startDate.getMonth() + 1}`.padStart(2, "0");
        const startDay = `${startDate.getDate()}`.padStart(2, "0");

        const endDate = new Date((+timeStamp + 86400 * validityTime) * 1000);
        const endYear = endDate.getFullYear();
        const endMonth = `${endDate.getMonth() + 1}`.padStart(2, "0");
        const endDay = `${endDate.getDate()}`.padStart(2, "0");

        const validityTimeDesc = `${startYear}年${startMonth}月${startDay}日至${endYear}年${endMonth}月${endDay}日内有效`;

        this.setData({ validityTimeDesc });
      },
    },
  },

  data: {
    validityTimeDesc: "",
  },
});
