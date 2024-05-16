import { store } from "../../../../../../store/index";
import { debounce } from "../../../../../../utils/index";
import SettingService from "../../utils/settingService";

const settingService = new SettingService();
const constellationOptions = [
  "水瓶座",
  "双鱼座",
  "白羊座",
  "金牛座",
  "双子座",
  "巨蟹座",
  "狮子座",
  "处女座",
  "天秤座",
  "天蝎座",
  "射手座",
  "摩羯座",
];

Page({
  data: {
    constellationOptions,
    genderOptions: ["保密", "男", "女"],
    userInfo: null,
    constellationIndex: -1,
    saveBtnActive: false,
  },

  onLoad() {
    const { constellation } = store.userInfo;
    const constellationIndex = constellationOptions.findIndex(
      (item) => item === constellation
    );
    this.setData({ userInfo: store.userInfo, constellationIndex });
  },

  onShow() {
    if (this.uploadingAvatar) {
      this.uploadAvatar();
    }

    if (this.uploadingBg) {
      this.uploadBg();
    }
  },

  cropAvatar() {
    this.uploadingAvatar = true;
    wx.navigateTo({
      url: "/pages/subpages/common/cropper/index",
    });
  },

  cropBg() {
    this.uploadingBg = true;
    wx.navigateTo({
      url: "/pages/subpages/common/cropper/index?height=107",
    });
  },

  async uploadAvatar() {
    if (!this.data.uploadAvatarLoading) {
      this.setData({ uploadAvatarLoading: true });
      if (store.croppedImagePath) {
        const avatar = await settingService.uploadFile(store.croppedImagePath);
        this.setData({
          ["userInfo.avatar"]: avatar,
        });
        if (!this.data.saveBtnActive) {
          this.setData({
            saveBtnActive: true,
          });
        }
        store.setCroppedImagePath("");
        this.uploadingAvatar = false;
      }
      this.setData({ uploadAvatarLoading: false });
    }
  },

  async uploadBg() {
    if (!this.data.uploadBgLoading) {
      this.setData({ uploadBgLoading: true });
      if (store.croppedImagePath) {
        const bg = await settingService.uploadFile(store.croppedImagePath);
        this.setData({
          ["userInfo.bg"]: bg,
        });
        if (!this.data.saveBtnActive) {
          this.setData({
            saveBtnActive: true,
          });
        }
        store.setCroppedImagePath("");
        this.uploadingBg = false;
      }
      this.setData({ uploadBgLoading: false });
    }
  },

  setNickname: debounce(function (e) {
    this.setData({
      ["userInfo.nickname"]: e.detail.value,
    });
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  }),

  selectGender(e) {
    this.setData({
      ["userInfo.gender"]: Number(e.detail.value),
    });
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  },

  selectConstellation(e) {
    const constellationIndex = Number(e.detail.value);
    this.setData({
      ["userInfo.constellation"]: constellationOptions[constellationIndex],
      constellationIndex,
    });
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  },

  selectBirthday(e) {
    this.setData({
      ["userInfo.birthday"]: e.detail.value,
    });
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  },

  setCareer: debounce(function (e) {
    this.setData({
      ["userInfo.career"]: e.detail.value,
    });
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  }),

  setSignature: debounce(function (e) {
    this.setData({
      ["userInfo.signature"]: e.detail.value,
    });
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  }),

  save() {
    const { saveBtnActive, userInfo } = this.data;
    if (!saveBtnActive) {
      return;
    }
    if (!userInfo.nickname) {
      wx.showToast({
        title: "昵称不能为空哦～",
      });
      return;
    }
    settingService.updateUserInfo(userInfo, () => {
      store.setUserInfo({ ...store.userInfo, ...userInfo });
      wx.navigateBack();
    });
  },

  cancel() {
    if (this.data.saveBtnActive) {
      wx.showModal({
        title: "信息已修改",
        content: "确定放弃修改吗？",
        success: (result) => {
          if (result.confirm) {
            wx.navigateBack();
          }
        },
      });
    } else {
      wx.navigateBack();
    }
  },
});
