import { action } from 'mobx-miniprogram'
import pushRoom from './push-room/index'

export default {
  definitionIndex: 2,
  audienceCount: 0,
  praiseCount: 0,
  
  setDefinitionIndex: action(function (index) {
    this.definitionIndex = index
  }),
  setAudienceCount: action(function (count) {
    this.audienceCount = count
  }),
  setPraiseCount: action(function (count) {
    this.praiseCount = count
  }),

  ...pushRoom,
}
