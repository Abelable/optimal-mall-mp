import { store } from "../store/index";
import { cleanObject } from "../utils/index";
import Base from "./base/index";

class BaseService extends Base {
  async getUserMobile(code) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/mobile`,
      data: { code }
    });
  }

  async register(code, avatar, nickname, mobile, superiorId, gender = 0) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/register`,
      data: cleanObject({ code, avatar, nickname, mobile, superiorId, gender })
    });
  }

  async login() {
    const { code } = await this.wxLogin();
    const token = await this.post({
      url: `${this.baseUrl}/auth/wx_mp/login`,
      data: { code }
    });
    wx.setStorageSync("token", token || "");
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

  async getPayParams(orderId) {
    return await this.post({
      url: `${this.baseUrl}/order/pay_params`,
      data: { orderId }
    });
  }

  async getQRCode(scene, page) {
    return await this.get({
      url: `${this.baseUrl}/wx/qrcode`,
      data: { scene, page },
      loadingTitle: "加载中..."
    });
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

  async addCart(goodsId, selectedSkuIndex, number) {
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
}

export default BaseService;
