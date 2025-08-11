import { action } from 'mobx-miniprogram'
import beauty from './beauty'

export default {
  devicePosition: 'front',
  remoteMirror: true,
  localMirror: 'auto',
  muted: false,
  definitionIndex: 2,
  lampVisible: false,

  setDevicePosition: action(function (status) {
    this.devicePosition = status
  }),
  setRemoteMirror: action(function (truthy) {
    this.remoteMirror = truthy
  }),
  setLocalMirror: action(function (status) {
    this.localMirror = status
  }),
  setMuted: action(function (turthy) {
    this.muted = turthy
  }),
  setDefinitionIndex: action(function (index) {
    this.definitionIndex = index
  }),
  toggleLampVisible: action(function () {
    this.lampVisible = !this.lampVisible
  }),

  ...beauty
}
