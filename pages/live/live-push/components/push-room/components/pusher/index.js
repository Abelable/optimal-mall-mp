import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../../../../store/index'

const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['devicePosition', 'remoteMirror', 'localMirror', 'beautyValue', 'whitenessValue', 'visualFilterValue', 'soundFilterValue', 'muted', 'definitionIndex', 'lampVisible']
  },

  properties: {
    src: String,
    start: Boolean,
    stop: Boolean
  },

  data: {
    statusBarHeight,
    definitionList: ['SD', 'HD', 'FHD'],
    visualFilterList: ['standard', 'pink', 'nostalgia', 'blues', 'romantic', 'cool', 'fresher', 'solor', 'aestheticism', 'whitening', 'cerisered'],
    smallScreenMode: ['push']
  },

  observers: {
    'start': function(truthy) {
      if (truthy) {
        this.ctx.start()
      }
    },
    'stop': function(truthy) {
      if (truthy) {
        this.ctx.stop()
      }
    },
    'devicePosition': function() {
      this.ctx && this.ctx.switchCamera()
    },
    'lampVisible': function() {
      this.ctx && this.ctx.toggleTorch()
    }
  },

  lifetimes: {
    attached() {
      this.ctx = wx.createLivePusherContext('live-pusher', this)
    }
  },

  pageLifetimes: {
    show() {
      if (store.muted) {
        this.ctx && this.ctx.mute()
      }
    }
  }
})
