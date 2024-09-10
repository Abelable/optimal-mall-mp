const VERSION = "v1";

// 环境配置：'pro' - 正式环境, 'dev' - 开发环境
const ENV = "dev";
const API_BASE_URL =
  ENV === "pro"
    ? "https://api.chengxinxingqiu.com"
    : "https://api.youbozhenxuan.cn";
const WEBVIEW_BASE_URL =
  ENV === "pro"
    ? "https://h5.chengxinxingqiu.com/#"
    : "https://h5.youbozhenxuan.cn/#";

export { VERSION, ENV, API_BASE_URL, WEBVIEW_BASE_URL };
