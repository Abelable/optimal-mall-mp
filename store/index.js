import { configure, observable, action } from "mobx-miniprogram";

configure({ enforceActions: "observed" }); // 不允许在动作外部修改状态

export const store = observable({
  userInfo: null,
  croppedImagePath: "",

  setUserInfo: action(function (info) {
    this.userInfo = info;
  }),
  setCroppedImagePath: action(function (path) {
    this.croppedImagePath = path;
  })
});
