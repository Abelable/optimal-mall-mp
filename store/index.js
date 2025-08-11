import { configure, observable, action } from "mobx-miniprogram";
import live from "./modules/live/index";

configure({ enforceActions: "observed" }); // 不允许在动作外部修改状态

export const store = observable({
  userInfo: null,
  promoterInfo: null,
  tim: null,
  croppedImagePath: "",

  setUserInfo: action(function (info) {
    this.userInfo = info;
  }),
  setPromoterInfo: action(function (info) {
    this.promoterInfo = info;
  }),
  setTim: action(function (tim) {
    this.tim = tim;
  }),
  setCroppedImagePath: action(function (path) {
    this.croppedImagePath = path;
  }),

  ...live,
});
