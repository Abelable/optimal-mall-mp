export const debounce = (fn, delay = 200) => {
  let timeout = null;
  return function () {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, arguments), delay);
  };
};

export const checkLogin = (success, domore = true) => {
  if (wx.getStorageSync("token")) {
    success && success();
  } else {
    if (typeof domore === "boolean") {
      domore && wx.navigateTo({ url: "/pages/subpages/common/register/index" });
    } else domore();
  }
};

export const formatDate = (date, format) => {
  const week = ["日", "一", "二", "三", "四", "五", "六"];
  const formatObj = {
    YYYY: date.getFullYear(),
    MM: `${date.getMonth() + 1}`.padStart(2, "0"),
    DD: `${date.getDate()}`.padStart(2, "0"),
    hh: `${date.getHours()}`.padStart(2, "0"),
    mm: `${date.getMinutes()}`.padStart(2, "0"),
    ss: `${date.getSeconds()}`.padStart(2, "0"),
    week: `星期${week[date.getDay()]}`
  };

  for (const key in formatObj) {
    format = format.replace(key, formatObj[key]);
  }

  return format;
};

export const getQueryString = (url, name) => {
  const paramsArr = url.substring(url.indexOf("?") + 1).split("&");
  let r = "";
  paramsArr.forEach(item => {
    const valueArr = item.split("=");
    if (valueArr[0] === name) r = valueArr[1];
  });
  return r;
};

/**
 * 自定义返回
 * @param {boolean} needInitPrePageData 返回前一个页面之前是否需要初始化前一个页面的数据（约定方法名为initData）
 */
export const customBack = (needInitPrePageData = false) => {
  const registerPageRoute = "pages/subpages/common/register/index";
  const minePageRoute = "/pages/mine/index";

  const curPages = getCurrentPages();
  const curPage = curPages[curPages.length - 1];
  const curPageRoute = curPage.route;
  const prePage = curPages[curPages.length - 2];
  const prePageRoute = prePage ? prePage.route : "";

  if (needInitPrePageData && typeof prePage.initData === "function") {
    prePage.initData();
  }

  if (
    curPages.length === 1 ||
    (curPageRoute === registerPageRoute && prePageRoute === minePageRoute)
  ) {
    wx.switchTab({ url: "/pages/home/index" });
  } else wx.navigateBack();
};

export const isVoid = value =>
  value === undefined || value === null || value === "";

export const cleanObject = object => {
  const result = { ...object };
  Object.keys(result).forEach(key => {
    if (isVoid(result[key])) delete result[key];
  });
  return result;
};

export const calcDistance = (la1, lo1, la2, lo2) => {
  const La1 = (la1 * Math.PI) / 180.0;
  const La2 = (la2 * Math.PI) / 180.0;
  const La3 = La1 - La2;
  const Lb3 = (lo1 * Math.PI) / 180.0 - (lo2 * Math.PI) / 180.0;
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(La3 / 2), 2) +
          Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)
      )
    );
  s = s * 6378.137; //地球半径
  s = Math.floor(Math.round(s * 10000) / 10000);
  return s;
};

export const weekDayList = [
  { text: "周一", value: 1 },
  { text: "周二", value: 2 },
  { text: "周三", value: 3 },
  { text: "周四", value: 4 },
  { text: "周五", value: 5 },
  { text: "周六", value: 6 },
  { text: "周日", value: 7 }
];

export const numOver = (num, unit) => {
  const unitDesc = unit === 1000 ? "k" : "w";
  const baseUnit = unit === 1000 ? 1000 : 10000;
  num = num >= unit ? (num / baseUnit).toFixed(1) + unitDesc : num;
  return num;
};

export const expressOptions = [
  { name: "中通快递", value: "ZTO" },
  { name: "圆通速递", value: "YTO" },
  { name: "韵达速递", value: "YD" },
  { name: "申通快递", value: "STO" },
  { name: "顺丰速运", value: "SF" },
  { name: "京东快递", value: "JD" },
  { name: "邮政快递包裹", value: "YZPY" },
  { name: "EMS", value: "EMS" },
  { name: "极兔速递", value: "JTSD" },
  { name: "德邦快递", value: "DBL" },
  { name: "丰网速运", value: "FWX" },
  { name: "百世快递", value: "HTKY" },
  { name: "优速快递", value: "UC" },
  { name: "众邮快递", value: "ZYE" },
  { name: "宅急送", value: "ZJS" }
];

export const randomNickname = () => {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const timestamp = (now % 1000000) + random;
  return timestamp.toString().slice(-6);
};
