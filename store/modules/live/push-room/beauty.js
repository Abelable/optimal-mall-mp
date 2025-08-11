import { action } from 'mobx-miniprogram'

export default {
  beautyValue: wx.getStorageSync('beautyValue') || 0,
  whitenessValue: wx.getStorageSync('whitenessValue') || 0,
  visualFilterValue: wx.getStorageSync('visualFilterValue') || 0,
  soundFilterValue: wx.getStorageSync('soundFilterValue') || 0,

  setBeautyValue: action(function (e) {
    this.beautyValue = e.constructor === Object ? e.detail.value : e
  }),
  setWhitenessValue: action(function (e) {
    this.whitenessValue = e.constructor === Object ? e.detail.value : e
  }),
  setVisualFilterValue: action(function (e) {
    this.visualFilterValue = e.constructor === Object ? Number(e.currentTarget.dataset.index) : e
  }),
  setSoundFilterValue: action(function (e) {
    this.soundFilterValue = e.constructor === Object ? Number(e.currentTarget.dataset.index) : e
  })
}
