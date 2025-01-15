Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    images: {
      type: Array,
      observer(list) {
        this.setData({
          imageList: list.slice(0, 3).map(item => `${item}?x-oss-process=image/resize,w_600`)
        });
      }
    }
  },

  data: {
    imageList: []
  },

  methods: {
    previewImage(e) {
      const { current } = e.currentTarget.dataset;
      const urls = this.properties.images;
      wx.previewImage({ current, urls });
    }
  }
});
