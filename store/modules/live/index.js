import { action } from 'mobx-miniprogram'
import pushRoom from './push-room/index'
import playRoom from './play-room/index'

export default {
  definitionIndex: 2,
  audienceCount: 0,
  praiseCount: 0,
  liveMsgList: [],
  
  setDefinitionIndex: action(function (index) {
    this.definitionIndex = index
  }),
  setAudienceCount: action(function (count) {
    this.audienceCount = count
  }),
  setPraiseCount: action(function (count) {
    this.praiseCount = count
  }),
  setLiveMsgList: action(function (msg) {
    switch (msg.constructor) {
      case Array:
        this.liveMsgList = [...this.liveMsgList, ...msg]
        break
      case Object:
        this.liveMsgList = [...this.liveMsgList, msg]
        break
    }
  }),

  ...pushRoom,
  ...playRoom
}
