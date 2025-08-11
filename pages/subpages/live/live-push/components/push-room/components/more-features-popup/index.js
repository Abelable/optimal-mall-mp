import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../../../../store/index'

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['devicePosition', 'localMirror', 'muted', 'lampVisible'],
  },

  properties: {
    roomInfo: Object,
    trafficPanelVisible: Boolean
  },
  
  methods: { 
    click(e) {
      switch (e.currentTarget.dataset.type) {
        case 'beauty': 
          this.triggerEvent('showBeautyPopup')
          break

        case 'hd': 
          this.triggerEvent('showHdPopup')
          break

        case 'reverse':
          store.setRemoteMirror(store.devicePosition === 'front' ? false : true)
          store.setDevicePosition(store.devicePosition === 'front' ? 'back' : 'front')
          store.setLocalMirror('auto')
          break
          
        case 'mirror':
          store.setLocalMirror(store.localMirror === 'auto' ? (store.devicePosition === 'front' ? 'disable' : 'enable') : 'auto')
          store.setRemoteMirror(!store.remoteMirror)
          break

        case 'mute': 
          store.setMuted(!store.muted)
          break

        case 'lamp': 
          store.toggleLampVisible(!store.lampVisible)
          break

        case 'subscribe': 
          this.triggerEvent('showSubscribePopup')
          break
      }
    },

    hide() {
      this.triggerEvent('hide')
    }
  }
})
