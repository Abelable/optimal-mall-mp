import TIM from 'tim-wx-sdk'
import { store } from '../../store/index'

// 加群
export const joinGroup = (groupID) => {
  return store.tim.joinGroup({ groupID, type: TIM.TYPES.GRP_AVCHATROOM }).catch(err => {
    console.warn('joinGroup error:', err)
  })
}

// 退群
export const quitGroup = (groupID) => {
  return store.tim.quitGroup(groupID).catch(err => {
    console.warn('quitGroup error:', err)
  })
}

// 发送群组聊天消息
export const sendLiveChatMsg = (selToId, chatMsg) => {
  const message = store.tim.createTextMessage({
    to: selToId,
    conversationType: TIM.TYPES.CONV_GROUP,
    payload: {
      text: JSON.stringify(chatMsg)
    }
  })
  return store.tim.sendMessage(message).catch(err => {
    console.warn('sendLiveChatMsg error:', err)
  })
}

// 发送自定义群组消息
export const sendLiveCustomMsg = (selToId, customMsg) => {
  const message = store.tim.createCustomMessage({
    to: selToId,
    conversationType: TIM.TYPES.CONV_GROUP,
    payload: {
      data: JSON.stringify(customMsg),
      description: '',
      extension: ''
    }
  })
  store.tim.sendMessage(message).catch(err => {
    console.warn('sendLiveCustomMsg error:', err)
  })
}

export const handleLiveCustomMsg = (data) => {
  getApp().globalData.liveCustomMsg = data
}

let liveChatMsgCache = []
let setLiveMsgListTimeout = null
export const handleLiveChatMsg = (payload) => {
  const liveChatMsg = JSON.parse(payload.data)
  liveChatMsg && liveChatMsgCache.push(liveChatMsg)

  if (!setLiveMsgListTimeout) {
    setLiveMsgListTimeout = setTimeout(() => {
      store.setLiveMsgList(liveChatMsgCache)
      liveChatMsgCache = []
      setLiveMsgListTimeout = null
    }, 100 * liveChatMsgCache.length)
  }
}
