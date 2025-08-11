import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../../../../store/index'

const { statusBarHeight } = getApp().globalData.systemInfo

Component({
  // 插槽相关
  options: {
    multipleSlots: true 
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['fullScreen'],
  },
  
  properties: {
    src: {
      type: String,
      observer(val) {
        val && this.setInitTimeout()
      }
    },
    horizontal: Boolean,
  },

  data: {
    statusBarHeight,
    mode: ['push', 'pop']
  },

  observers: {
    'fullScreen': function(truthy) {
      this.player && (truthy ? this.player.requestFullScreen({ direction: 90 }) : this.player.exitFullScreen())
    },
  },

  attached() {
    this.player = wx.createLivePlayerContext('live-player', this)
  },

  detached() {
    this.clearInitTimeout()
  },

  methods: {
    setInitTimeout() {
      this.initTimeout = setTimeout(() => {
        store.setSrcIniting(false)
      }, 3000)
    },

    clearInitTimeout() {
      if (this.initTimeout) {
        clearTimeout(this.initTimeout)
        this.initTimeout = null
      }
    },

    statechange(e) {
      if (e.detail.code) {
        if ([-2301, -2302, 2007, 3001, 3002, 3003, 3005].includes(e.detail.code)) {
          !store.liveLoading && store.setLiveLoading(true)
        }
        if (e.detail.code == 2004) {
          // 如果先监听到直播流正常播放则取消定时器，直接设置已完成初始化状态
          this.clearInitTimeout()
          store.setSrcIniting(false)
          
          liveLoading && store.setLiveLoading(false)
        }
      } else {
        this.clearInitTimeout()
        store.setSrcIniting(false)
      }
    },
  }
})
