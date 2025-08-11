import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../store/index'
import { debounce } from '../../../../../../../utils/index'

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['liveMsgList'],
  },

  properties: {
    fullScreen: Boolean
  },

  data: {
    scrollTop: 0,
    multiple: 1
  },

  observers: {
    'liveMsgList': debounce(function(list) {
      if (list.length && !this.stopScroll) {
        const query = this.createSelectorQuery()
        const promise_wrap = new Promise(resolve => {
          query.select('.comment').boundingClientRect(res => {
            res && resolve(res.height)
          })
        })
        const promise_content = new Promise(resolve => {
          query.select('.msg-lists').boundingClientRect(res => {
            res && resolve(res.height)
          })
        })
        Promise.all([promise_wrap, promise_content]).then(res => {
          this.setData({
            scrollTop: res[1] - res[0]
          })
        })
        query.exec()
      }
    })
  },

  lifetimes: {
    attached() {
      this.stopScroll = false
    }
  },
  
  methods: {
    onTouchStart() {
      if (this.stopScrollTimeout) {
        clearTimeout(this.stopScrollTimeout)
      }
      if (!this.stopScroll) {
        this.stopScroll = true
      }
    },

    onTouchEnd() {
      if (this.stopScrollTimeout) {
        clearTimeout(this.stopScrollTimeout)
      }
      this.stopScrollTimeout = setTimeout(() => {
        if (this.stopScroll) {
          this.stopScroll = false
        }
        if (this.data.multiple !== 1) {
          this.setData({ multiple: 1 })
        }
      }, 2000)
    },

    showMore: debounce(function() {
      this.setData({
        multiple: ++this.data.multiple
      })
    })
  }
})
