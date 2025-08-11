import { action } from 'mobx-miniprogram'

export default {
  fullScreen: false,               // 全屏（横屏状态）
  srcIniting: true,          // 视频源、拉流正在加载
  liveLoading: false,              // 直播卡顿

  resetRoomData: action(function () {
    this.srcIniting = true
    this.liveLoading = false
    this.liveMsgList = []
  }),
  setFullScreen: action(function () {
    this.fullScreen = true
  }),
  exitFullScreen: action(function () {
    this.fullScreen = false
  }),
  setSrcIniting: action(function (truthy) {
    this.srcIniting = truthy
  }),
  setLiveLoading: action(function (truthy) {
    this.liveLoading = truthy
  }),
  setAudienceCount: action(function (count) {
    this.audienceCount = count
  }),
  setPraiseCount: action(function (count) {
    this.praiseCount = count
  }),
}
