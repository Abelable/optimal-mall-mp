Page({
  data: {
    licenseList: []
  },

  async onLoad({ license }) {
    const licenseList = JSON.parse(license).map(
      item =>
        `${item}?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,size_24,text_5LuF5L6b6K-a5L-h5pif55CD5bmz5Y-w5bGV56S65L2_55SoLCDku5bnlKjml6DmlYg=,color_999999,rotate_315,t_100,g_se,x_10,y_10,fill_1`
    );
    this.setData({ licenseList });
  },

  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({ current, urls });
  }
});
