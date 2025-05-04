import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';

/**
 * Strategy “kc-m2m” che verifica la firma RS256 sul token M2M.
 * **Non** restituisce un utente: se il token è valido → passa.
 */
@Injectable()
export class InboundJwtStrategy extends PassportStrategy(Strategy, 'kc-m2m') {
  constructor(@Inject(ConfigService) cfg: ConfigService) {
    const issuer = `${cfg.get('KC_SERVER_URL')}/realms/${cfg.get('KC_REALM')}`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: cfg.get('KC_CLIENT_ID'),
      issuer,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.expressJwtSecret({
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 10_000,
      }) as any, // jwks-rsa type mismatch, cast for TS
    });
  }

  validate(payload: any) {
    // se arriviamo qui il token è valido → possiamo arricchire req.user se serve
    return payload;
  }
}