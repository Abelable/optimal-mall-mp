// import TIM from "tim-wx-sdk";
import TIM from '@tencentcloud/chat';
import TIMUploadPlugin from "tim-upload-plugin";
import { store } from "../../store/index";
import {
  joinGroup,
  quitGroup,
  sendLiveChatMsg,
  sendLiveCustomMsg,
  handleLiveCustomMsg,
  handleLiveChatMsg
} from "./group";

const init = (SDKAppID, userID, userSig) => {
  const tim = TIM.create({ SDKAppID });
  tim.setLogLevel(1);
  tim.registerPlugin({ "tim-upload-plugin": TIMUploadPlugin });
  tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMsgReceive);
  tim.login({ userID, userSig });
  store.setTim(tim);
};

const logout = () => {
  store.tim.off(TIM.EVENT.MESSAGE_RECEIVED, onMsgReceive);
  store.tim.logout();
  store.setTim(null);
};

const onMsgReceive = ({ data = [] }) => {
  data.forEach(item => {
    const { conversationType, type, payload } = item;
    switch (conversationType) {
      case TIM.TYPES.CONV_SYSTEM:
        if (type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
          if (payload.userDefinedField) {
            handleLiveCustomMsg(JSON.parse(payload.userDefinedField).data);
          }
        }
        break;

      case TIM.TYPES.CONV_GROUP:
        if (type === TIM.TYPES.MSG_TEXT) {
          handleLiveChatMsg(payload);
        } else if (type === TIM.TYPES.MSG_CUSTOM) {
          handleLiveCustomMsg(payload);
        }
        break;
    }
  });
};

export default {
  init,
  logout,
  joinGroup,
  quitGroup,
  sendLiveChatMsg,
  sendLiveCustomMsg
};
