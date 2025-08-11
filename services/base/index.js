import { API_BASE_URL, VERSION } from "../../config";
import Log from "../../utils/log";
import api from "./api";

class Base {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/${VERSION}`;
  }

  async get({ url, data, success, fail, loadingTitle }) {
    const client = () => this.request({ url, data, loadingTitle });
    return await this.handleResult(url, client, success, fail);
  }

  async post({ url, data, success, fail, loadingTitle }) {
    const client = () =>
      this.request({ url, data, method: "POST", loadingTitle });
    return await this.handleResult(url, client, success, fail);
  }

  async request({ url, data, method = "GET", loadingTitle }) {
    loadingTitle && wx.showLoading({ title: loadingTitle });
    const token = wx.getStorageSync("token");
    return api
      .request({
        url,
        method,
        data,
        header: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      })
      .then(res => [res, null])
      .catch(err => [null, err])
      .finally(() => {
        loadingTitle && wx.hideLoading();
      });
  }

  async handleResult(url, client, success, fail) {
    const [res, err] = (await client()) || [];

    if (err) {
      if (err.errMsg.includes("network change")) {
        return await this.handleResult(url, client, success, fail);
      } else {
        wx.showToast({
          title: err.errMsg.includes("request:fail") ? "网络异常" : err.errMsg,
          icon: "none"
        });
      }
      return;
    }

    // 未授权：token过期，可通过刷新token继续访问
    if (res.statusCode === 401) {
      await this.refreshToken();
      return await this.handleResult(url, client, success, fail);
    }

    // 禁止访问: 没有携带token，或者token无效
    // tips: 目前设定的场景，仅为token失效（即刷新token接口，报403），暂无其他场景会报403，
    //       所以仅执行重新登录的操作，不作类似401的执行重新请求的操作
    if (res.statusCode === 403) {
      // 对于没有携带token访问鉴权接口的情况，直接作为bug处理
      // tips: 这里假设一种被黑客攻击的情况，黑客携带假token访问（流程为：报401->执行刷新token操作->报403->执行重新登录操作），
      //       由于是假token，不存在当前用户，重新登录并不会返回token，如果依旧用之前的token，执行重新请求的操作，就会导致死循环
      //       所以修改登录逻辑，如果不存在token，依旧执行缓存token的操作，只是存一个空值。
      //       假设这个情况成立，则这里的报错就包含两种情况：1.代码写的不严谨，确实有漏洞，需要排查 2.被黑客攻击
      if (!wx.getStorageSync("token")) {
        Log.error({
          url,
          statusCode: res.statusCode,
          message: res.data.message
        });
        wx.navigateTo({ url: "/pages/subpages/common/register/index" });
        return;
      }
      await this.login();
      return;
    }

    // 剩余错误情况，弹出错误提示
    if (![200, 201, 204].includes(res.statusCode)) {
      Log.error({
        url,
        statusCode: res.statusCode,
        message: res.data.message
      });
      wx.showToast({ title: res.data.message, icon: "none" });
      return;
    }

    if (res.data.code === 0) {
      if (success) success(res.data);
      else return res.data.data;
    } else {
      fail
        ? fail(res)
        : wx.showToast({ title: res.data.message, icon: "none" });
    }
  }

  async uploadFile(filePath) {
    const ossConfig = await this.getOssConfig();

    const fileName = `${filePath
      .replace("http://tmp/", "")
      .replace("wxfile://tmp_", "")}`;
    const formData = {
      key: `${ossConfig.dir}${fileName}`,
      success_action_status: "200",
      "x-oss-object-acl": "public-read",
      "x-oss-meta-fullname": fileName,
      OSSAccessKeyId: ossConfig.accessId,
      policy: ossConfig.policy,
      signature: ossConfig.signature
    };

    const res = await api.uploadFile({
      url: ossConfig.host,
      filePath,
      name: "file",
      formData
    });
    if (res.statusCode === 200) {
      return `${ossConfig.host}/${ossConfig.dir}${fileName}`;
    } else {
      this.getOssInfo();
      wx.showToast({ title: "资源上传失败, 请重试", icon: "none" });
      return "";
    }
  }

  async getSetting() {
    return api.getSetting();
  }

  async chooseImage(count, fail) {
    return api.chooseImage({ count }).catch(err => {
      fail && fail(err);
    });
  }

  async chooseVideo(fail) {
    return api
      .chooseVideo({
        sourceType: ["album", "camera"],
        compressed: false
      })
      .catch(err => {
        fail && fail(err);
      });
  }

  async getLocation() {
    return api.getLocation();
  }

  async getUserProfile() {
    return api.getUserProfile({ desc: "用于完善会员资料" });
  }

  async getImageInfo(src) {
    return api.getImageInfo({ src });
  }

  async wxLogin() {
    return api.login();
  }

  async requestSubscribeMessage(tmplId) {
    return api.requestSubscribeMessage({ tmplIds: [tmplId] });
  }
}

export default Base;
