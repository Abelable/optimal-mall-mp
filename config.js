const VERSION = "v1";
const ACTIVITY_TEMPLATE_ID = "Dt7P0wZS10kpAsLFVGSgnG0L2g9D_XNnBfD3w3J9-v0";

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

export { VERSION, ACTIVITY_TEMPLATE_ID, ENV, API_BASE_URL, WEBVIEW_BASE_URL };
