import { ACTIVITY_TEMPLATE_ID } from "../config";
import { store } from "../store/index";
import { cleanObject, randomNickname } from "../utils/index";
import Base from "./base/index";

class BaseService extends Base {
  async getLocationInfo() {
    const { authSetting } = await this.getSetting();
    if (authSetting["scope.userLocation"] !== false) {
      const { longitude, latitude } = await this.getLocation();
      return { longitude, latitude };
    }
  }

  async getUserMobile(code) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/mobile`,
      data: { code }
    });
  }

  async register(code, mobile, superiorId) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/register`,
      data: cleanObject({
        code,
        avatar: "https://static.chengxinxingqiu.cn/mp/default_avatar.png",
        nickname: `用户${randomNickname()}`,
        mobile,
        superiorId,
        gender: 0
      })
    });
  }

  async login() {
    const { code } = await this.wxLogin();
    const token = await this.post({
      url: `${this.baseUrl}/auth/wx_mp/login`,
      data: { code }
    });
    token && wx.setStorageSync("token", token);
  }

  async refreshToken() {
    const token = await this.get({ url: `${this.baseUrl}/auth/token_refresh` });
    if (token) {
      wx.setStorageSync("token", token);
    }
  }

  async getUserInfo() {
    const userInfo = await this.get({ url: `${this.baseUrl}/user/info` });
    store.setUserInfo(userInfo);
    return userInfo;
  }

  async updateUserInfo(userInfo, success) {
    return await this.post({
      url: `${this.baseUrl}/user/update`,
      data: cleanObject(userInfo),
      success
    });
  }

  async getSuperiorInfo(superiorId) {
    return this.get({
      url: `${this.baseUrl}/user/superior_info`,
      data: { superiorId }
    });
  }

  async getTimLoginInfo() {
    return await this.get({ url: `${this.baseUrl}/user/tim_login_info` });
  }

  async getOssConfig() {
    if (wx.getStorageSync("ossConfig")) {
      const ossConfig = JSON.parse(wx.getStorageSync("ossConfig"));
      if (new Date().getTime() < ossConfig.expire * 1000) {
        return ossConfig;
      }
    }
    const ossConfig = await this.get({ url: `${this.baseUrl}/oss_config` });
    wx.setStorage({
      key: "ossConfig",
      data: JSON.stringify(ossConfig)
    });
    return ossConfig;
  }

  async getPayParams(orderIds) {
    return await this.post({
      url: `${this.baseUrl}/order/pay_params`,
      data: { orderIds }
    });
  }

  async getQRCode(scene, page) {
    return await this.get({
      url: `${this.baseUrl}/wx/qrcode`,
      data: { scene, page },
      loadingTitle: "加载中..."
    });
  }

  async getAdInfo() {
    return await this.get({ url: `${this.baseUrl}/banner/pop` });
  }

  async getBannerList(position = 1) {
    return await this.get({
      url: `${this.baseUrl}/banner/list`,
      data: { position }
    });
  }

  async subscribeActivity(activityId, success) {
    const wxSubRes = await this.requestSubscribeMessage(ACTIVITY_TEMPLATE_ID);
    if (wxSubRes[ACTIVITY_TEMPLATE_ID] === "accept") {
      return await this.post({
        url: `${this.baseUrl}/mall/activity_subscribe`,
        data: { activityId },
        success
      });
    } else {
      wx.showToast({
        title: "订阅失败，如未点击取消，请到小程序的设置中打开授权",
        icon: "none",
        duration: 3000
      });
    }
  }

  async getAddressList() {
    return await this.get({ url: `${this.baseUrl}/address/list` });
  }

  async getHistoryKeywords() {
    return await this.get({
      url: `${this.baseUrl}/keyword/list`,
      loadingTitle: "加载中..."
    });
  }

  async saveKeywords(keywords) {
    return await this.post({
      url: `${this.baseUrl}/keyword/add`,
      data: { keywords }
    });
  }

  async clearHistoryKeywords() {
    return await this.post({
      url: `${this.baseUrl}/keyword/clear`
    });
  }

  async getHotKeywords() {
    return await this.get({
      url: `${this.baseUrl}/keyword/hot_list`,
      loadingTitle: "加载中..."
    });
  }

  async getGoodsList({ categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/goods/list`,
        data: cleanObject({
          categoryId,
          sort,
          order,
          page,
          limit
        }),
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async getRecommedGoodsList(goodsIds, categoryIds, page, limit = 10) {
    const { list = [] } =
      (await this.post({
        url: `${this.baseUrl}/goods/recommend_list`,
        data: { goodsIds, categoryIds, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async searchGoodsList({
    keywords,
    categoryId,
    sort,
    order,
    page,
    limit = 10
  }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/goods/search`,
        data: cleanObject({ keywords, categoryId, sort, order, page, limit }),
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async getDefaultAddress() {
    return await this.get({
      url: `${this.baseUrl}/address/default`
    });
  }

  async getCartGoodsNumber() {
    return await this.get({
      url: `${this.baseUrl}/cart/goods_number`
    });
  }

  async fastAddCart(goodsId, selectedSkuIndex, number) {
    return await this.post({
      url: `${this.baseUrl}/cart/fast_add`,
      data: { goodsId, selectedSkuIndex, number }
    });
  }

  async addCart(goodsId, selectedSkuIndex = 0, number = 1) {
    return await this.post({
      url: `${this.baseUrl}/cart/add`,
      data: { goodsId, selectedSkuIndex, number }
    });
  }

  async editCart(id, goodsId, selectedSkuIndex, number, success) {
    return await this.post({
      url: `${this.baseUrl}/cart/edit`,
      data: { id, goodsId, selectedSkuIndex, number },
      success
    });
  }

  async getMerchantInfo(merchantId) {
    return await this.get({
      url: `${this.baseUrl}/goods/merchant_info`,
      data: { merchantId }
    });
  }

  async getGoodsInfo(id, addressId) {
    return await this.get({
      url: `${this.baseUrl}/goods/detail`,
      data: cleanObject({ id, addressId }),
      loadingTitle: "加载中..."
    });
  }

  async getPurchasedGoodsList(goodsId, scene = 1) {
    return await this.get({
      url: `${this.baseUrl}/goods/purchased_list`,
      data: { goodsId, scene }
    });
  }

  async getCartList() {
    return await this.get({
      url: `${this.baseUrl}/cart/list`,
      loadingTitle: "加载中..."
    });
  }

  async fastAddCart(goodsId, selectedSkuIndex, number) {
    return await this.post({
      url: `${this.baseUrl}/cart/fast_add`,
      data: { goodsId, selectedSkuIndex, number }
    });
  }

  async editCart(id, goodsId, selectedSkuIndex, number, success) {
    return await this.post({
      url: `${this.baseUrl}/cart/edit`,
      data: { id, goodsId, selectedSkuIndex, number },
      success
    });
  }

  async deleteCartList(ids, success) {
    return await this.post({
      url: `${this.baseUrl}/cart/delete`,
      data: { ids },
      success
    });
  }

  async getRoomStatus() {
    return await this.get({ url: `${this.baseUrl}/live/room_status` });
  }

  async getLiveList(page, limit = 10, id = 0) {
    return await this.get({
      url: `${this.baseUrl}/live/list`,
      data: { page, limit, id }
    });
  }

  async followAuthor(authorId, success) {
    return await this.post({
      url: `${this.baseUrl}/fan/follow`,
      data: { authorId },
      success
    });
  }

  async cancelFollowAuthor(authorId, success) {
    return await this.post({
      url: `${this.baseUrl}/fan/cancel_follow`,
      data: { authorId },
      success
    });
  }

  async getFollowStatus(authorId) {
    return await this.get({
      url: `${this.baseUrl}/fan/follow_status`,
      data: { authorId }
    });
  }

  async subscribeAnchor(anchorId, success) {
    return await this.post({
      url: `${this.baseUrl}/live/subscribe`,
      data: { anchorId },
      success
    });
  }
}

export default BaseService;
