Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    images: {
      type: Array,
      observer(list) {
        this.setData({
          imageList: list.slice(0, 3)
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
      const urls = this.data.imageList;
      wx.previewImage({ current, urls });
    }
  }
});
