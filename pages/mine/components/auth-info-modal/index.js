import { store } from "../../../../store/index";
import MineService from "../../utils/mineService";

const mineService = new MineService();

Component({
  data: {
    avatar: "",
    nickname: ""
  },

  lifetimes: {
    attached() {
      const { avatar, nickname } = store.userInfo;
      this.setData({ avatar, nickname });
    }
  },

  methods: {
    async chooseAvatar(e) {
      const avatar = (await mineService.uploadFile(e.detail.avatarUrl)) || "";
      this.setData({ avatar });
    },

    setNickname(e) {
      const nickname = e.detail.value;
      this.setData({ nickname });
    },

    save() {
      const { avatar, nickname } = this.data;
      if (!avatar) {
        wx.showToast({
          title: "头像不能为空哦～"
        });
        return;
      }
      if (!nickname) {
        wx.showToast({
          title: "昵称不能为空哦～"
        });
        return;
      }
      mineService.updateUserInfo(
        { ...store.userInfo, avatar, nickname },
        () => {
          store.setUserInfo({ ...store.userInfo, avatar, nickname });
          this.hide();
        }
      );
    },

    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});
