Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: {
      type: Object,
      observer(info) {
        const mobile = `${info.mobile.slice(0, 3)}****${info.mobile.slice(-4)}`
        this.setData({ mobile })
      }
    },
  },

  data: {
    mobile: ""
  }
});
