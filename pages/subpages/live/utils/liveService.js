import BaseService from "../../../../services/baseService";

class LiveService extends BaseService {
  async createLive(roomInfo, success) {
    return await this.post({
      url: `${this.baseUrl}/live/create`,
      data: roomInfo,
      success
    });
  }

  async getNoticeRoomInfo() {
    return await this.get({
      url: `${this.baseUrl}/live/notice_room`,
      loadingTitle: "加载中"
    });
  }

  async deleteNoticeRoom(success) {
    return await this.post({
      url: `${this.baseUrl}/live/delete_notice_room`,
      success
    });
  }

  async getPushRoomInfo() {
    return await this.get({
      url: `${this.baseUrl}/live/push_room`,
      loadingTitle: "加载中"
    });
  }

  async startLive() {
    return await this.post({
      url: `${this.baseUrl}/live/start`
    });
  }

  async stopLive(success) {
    return await this.post({
      url: `${this.baseUrl}/live/stop`,
      success
    });
  }

  async savePraiseCount(id, count) {
    return await this.post({
      url: `${this.baseUrl}/live/praise`,
      data: { id, count }
    });
  }

  async getPushRoomGoodsList(status) {
    return await this.get({
      url: `${this.baseUrl}/live/push_room_goods_list`,
      data: { status },
      loadingTitle: "加载中"
    });
  }

  async listingGoods(goodsIds, success) {
    return await this.post({
      url: `${this.baseUrl}/live/listing_goods`,
      data: { goodsIds },
      success
    });
  }

  async delistingGoods(goodsIds, success) {
    return await this.post({
      url: `${this.baseUrl}/live/de_listing_goods`,
      data: { goodsIds },
      success
    });
  }

  async setHotGoods(goodsId, success) {
    return await this.post({
      url: `${this.baseUrl}/live/set_hot_goods`,
      data: { goodsId },
      success
    });
  }

  async cancelHotGoods(goodsId, success) {
    return await this.post({
      url: `${this.baseUrl}/live/cancel_hot_goods`,
      data: { goodsId },
      success
    });
  }

  async getRoomList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/live/list`,
      data: { id, page, limit }
    });
  }

  async joinRoom(id) {
    return await this.post({
      url: `${this.baseUrl}/live/join_room`,
      data: { id }
    });
  }

  async getRoomGoodsList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/live/goods_list`,
      data: { id, page, limit },
      loadingTitle: "加载中"
    });
  }

  async saveLiveChatMsg(id, content, identity) {
    return await this.post({
      url: `${this.baseUrl}/live/comment`,
      data: { id, content, identity }
    });
  }
}

export default LiveService;
