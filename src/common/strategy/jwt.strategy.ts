import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants/jwt.constant';
import { Logger } from '../utils/logger';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  private readonly logger = new Logger(JwtStrategy.name);

  async validate(payload: unknown) {
    this.logger.log(payload);
    return payload;
  }
}
