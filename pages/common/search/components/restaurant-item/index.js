import dayjs from "dayjs";
import { store } from "../../../../../../store/index";
import { weekDayList, calcDistance } from "../../../../../../utils/index";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    item: {
      type: Object,
      observer(info) {
        if (info) {
          const { longitude: lo1, latitude: la1 } = store.locationInfo;
          const {
            longitude: lo2,
            latitude: la2,
            openTimeList,
            facilityList,
            setMealList,
          } = info;

          const distance = calcDistance(la1, lo1, la2, lo2);

          const curWeekDay = dayjs().day() + 1;
          const curTime = dayjs().format("HH:mm");
          const openTimeDescList = openTimeList.map((time) => {
            if (
              curWeekDay >= time.startWeekDay &&
              curWeekDay <= time.endWeekDay
            ) {
              const timeFrameIdx = time.timeFrameList.findIndex((timeFrame) => {
                const _curTime = +curTime.replace(":", "");
                const _openTime = +timeFrame.openTime.replace(":", "");
                const _closeTime = +timeFrame.closeTime.replace(":", "");
                return _curTime >= _openTime && _curTime <= _closeTime;
              });
              this.setData({ openStatus: timeFrameIdx !== -1 });
            }
            const startWeekDay = weekDayList.find(
              (week) => week.value == time.startWeekDay
            ).text;
            const endWeekDay = weekDayList.find(
              (week) => week.value == time.endWeekDay
            ).text;
            const timeFrameDesc = time.timeFrameList
              .map(
                (timeFrame) => `${timeFrame.openTime}-${timeFrame.closeTime}`
              )
              .join();
            return `${startWeekDay}至${endWeekDay}: ${timeFrameDesc}`;
          });

          if (setMealList.length) {
            const { price, originalPrice } = setMealList[0];
            const setMealDiscount = parseFloat(
              ((price / originalPrice) * 10).toFixed(1)
            );
            this.setData({ setMealDiscount });
          }

          this.setData({
            distance,
            openTimeDescList,
            facilityList: facilityList.slice(0, 3),
          });
        }
      },
    },
  },

  data: {
    distance: 0,
    openStatus: false,
    openTimeDescList: [],
    facilityList: [],
    setMealDiscount: 0,
  },
});
