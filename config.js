const VERSION = 'v1'

// 环境配置：'pro' - 正式环境, 'dev' - 开发环境
const ENV = 'pro' 
const API_BASE_URL = ENV === 'pro' ? 'https://api.youbozhenxuan.cn' : 'http://localhost'
const WEBVIEW_BASE_URL = ENV === 'pro' ? 'https://h5.youboi.com/tiddler/webview/index.html#' : 'http://localhost'
const QQ_MAP_KEY = 'BGCBZ-UFHWX-MBQ4O-TANN2-7WTZ3-CLBIP'

export {
  VERSION,
  ENV,
  API_BASE_URL,
  WEBVIEW_BASE_URL,
  QQ_MAP_KEY
}
