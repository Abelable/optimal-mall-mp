Page({
  data: {
    url: ""
  },

  async onLoad(options) {
    let { url, ...rest } = options;
    for (let key in rest) {
      if (rest.hasOwnProperty(key) && rest[key])
        url += `${url.indexOf("?") === -1 ? "?" : "&"}${key}=${rest[key]}`;
    }
    this.webviewUrl = url;
  },

  onShow() {
    setTimeout(() => {
      const token = wx.getStorageSync("token");
      if (token) {
        this.setData({
          url: `${this.webviewUrl}${
            this.webviewUrl.indexOf("?") === -1 ? "?" : "&"
          }token=${wx.getStorageSync("token")}`
        });
      } else {
        this.setData({
          url: this.webviewUrl
        });
      }
    });
  },

  onShareAppMessage() {
    const path = `/pages/common/webview/index?url=${this.webviewUrl.replace(
      "?",
      "&"
    )}`;
    return { path };
  }
});
