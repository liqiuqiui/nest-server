declare interface WxLoginRes {
  openid?: string;
  session_key?: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

declare interface WeiXinConfig {
  appid: string;
  secret: string;
}
