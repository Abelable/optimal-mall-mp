Component({
  properties: {
    info: Object
  },

  methods: {
    linkTo() {
      const { scene, param } = this.properties.info || {};
      if (scene) {
        switch (scene) {
          case 1:
            wx.navigateTo({
              url: `/pages/common/webview/index?url=${param}`
            });
            break;

          case 2:
            wx.navigateTo({
              url: `/pages/home/subpages/goods-detail/index?id=${param}`
            });
            break;
        }
      }
      this.hide();
    },

    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});
