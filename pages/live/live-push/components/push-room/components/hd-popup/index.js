import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../../../../store/index'

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['definitionIndex'],
  },

  properties: {
    roomInfo: Object,
    trafficPanelVisible: Boolean
  },

  data: {
    resolutionList: [
      { name: "标清", detail: "480P/1000kbps" },
      { name: "高清", detail: "720P/1500kbps" },
      { name: "超清", detail: "1080P/1800kbps" },
    ],
  },
  
  methods: { 
    selectResolution(e) {
      const { index } = e.currentTarget.dataset
      store.setDefinitionIndex(Number(index))
    },

    hide() {
      this.triggerEvent('hide')
    }
  }
})
