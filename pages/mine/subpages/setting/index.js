import { WEBVIEW_BASE_URL } from "../../../../config";

Page({
  editUserInfo() {
    wx.navigateTo({
      url: "./subpages/user-info-setting/index"
    });
  },

  applyTeamLeader() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/team_leader/settle_in`;
    wx.navigateTo({ url });
  }
});
