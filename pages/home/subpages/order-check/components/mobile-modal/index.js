Component({
  methods: {
    setMobile(e) {
      this.mobile = e.detail.value
    },

    confirm() {
      if (!this.mobile || !/^1[345789][0-9]{9}$/.test(this.mobile)) {
        wx.showToast({
          title: "请输入正确手机号",
          icon: "none"
        });
        return;
      }
      this.triggerEvent("confirm", this.data.pickedIdx);
    },

    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});
