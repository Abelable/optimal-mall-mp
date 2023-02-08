Component({
  data: {
    show: false
  },

  lifetimes: {
    attached() {
      setTimeout(() => {
        this.setData({ show: true })
      }, 50)
    }
  },

  methods: {
    hide() {
      this.setData({
        show: false
      }, () => {
        setTimeout(() => {
          this.triggerEvent('hide')
        }, 200)
      })
    },

    catchtap() {}
  }
})