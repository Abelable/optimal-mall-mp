import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../../../../store/index'
import { debounce } from '../../../../../../../../../../utils/index'

Component({ 
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['beautyValue', 'whitenessValue', 'visualFilterValue', 'soundFilterValue'],
    actions: ['setBeautyValue', 'setWhitenessValue', 'setVisualFilterValue', 'setSoundFilterValue']
  },

  data: {
    curMenuIndex: 0
  },

  lifetimes: {
    detached() {
      this.storeValue()
    }
  },
  
  methods: { 
    switchMenu(e) {
      this.setData({
        curMenuIndex: Number(e.currentTarget.dataset.index)
      })
    },

    debouncedSetBeautyValue: debounce(function(e) {
      this.setBeautyValue(Number(e.detail.value))
    }),

    debouncedSetWhitenessValue: debounce(function(e) {
      this.setWhitenessValue(Number(e.detail.value))
    }),

    setVisualFilter(e) {
      this.setVisualFilterValue(Number(e.currentTarget.dataset.index))
    },

    setSoundFilter(e) {
      this.setSoundFilterValue(Number(e.currentTarget.dataset.index))
    },

    reset() {
      const { beautyValue, whitenessValue, visualFilterValue, soundFilterValue } = this.data
      beautyValue != 0 && this.setBeautyValue(0)
      whitenessValue != 0 && this.setWhitenessValue(0)
      visualFilterValue != 0 && this.setVisualFilterValue(0)
      soundFilterValue != 0 && this.setSoundFilterValue(0)
    },

    storeValue() {
      const { beautyValue, whitenessValue, visualFilterValue, soundFilterValue } = this.data
      beautyValue != 0 && wx.setStorage({ key: 'beautyValue', data: beautyValue })
      whitenessValue != 0 && wx.setStorage({ key: 'whitenessValue', data: whitenessValue })
      visualFilterValue != 0 && wx.setStorage({ key: 'visualFilterValue', data: visualFilterValue })
      soundFilterValue != 0 && wx.setStorage({ key: 'soundFilterValue', data: soundFilterValue })
    },

    hide() {
      this.triggerEvent('hide')
    }
  }
})
