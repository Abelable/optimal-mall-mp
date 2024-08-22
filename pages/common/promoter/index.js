import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../../store/index'

Page({
  data: {
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['promoterInfo']
    })
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
})
