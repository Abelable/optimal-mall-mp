import { WEBVIEW_BASE_URL } from "../../../../config";

Page({
  applyTeamLeader() {
    const url = `/pages/common/webview/index?url=${WEBVIEW_BASE_URL}/team_leader/settle_in`;
    wx.navigateTo({ url });
  }
});
