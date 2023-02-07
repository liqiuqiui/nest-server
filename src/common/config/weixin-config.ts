import { registerAs } from '@nestjs/config';

export default registerAs<WeiXinConfig>('wx', () => ({
  appid: process.env.APPID,
  secret: process.env.SECRET,
}));
