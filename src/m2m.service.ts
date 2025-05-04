import axios from 'axios';
import { Injectable, Scope, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.DEFAULT })
export class KeycloakM2MService {
  private accessToken = '';
  private expiresAt   = 0;                         // epoch ms

  constructor(private readonly cfg: ConfigService) {}

  async getToken(): Promise<string> {
    const now = Date.now();
    if (now < this.expiresAt - 30_000 && this.accessToken) return this.accessToken;

    /* ------------------------------------------------------------
     * 1.  leggi variabili (e fallisci subito se mancano)
     * ---------------------------------------------------------- */
    const realm = this.cfg.get<string>('KC_REALM');
    const baseUrl = this.cfg.get<string>('KC_SERVER_URL');
    const clientId = this.cfg.get<string>('KC_CLIENT_ID');
    const clientSecret = this.cfg.get<string>('KC_CLIENT_SECRET');

    if (!realm || !baseUrl || !clientId || !clientSecret)
      throw new InternalServerErrorException(
        'KC_* env vars missing (KC_SERVER_URL, KC_REALM, KC_CLIENT_ID, KC_CLIENT_SECRET)',
      );

    /* ------------------------------------------------------------
     * 2.  compila URLSearchParams in modo “type-safe”
     * ---------------------------------------------------------- */
    const params = new URLSearchParams();
    params.append('grant_type','client_credentials');
    params.append('client_id',clientId);
    params.append('client_secret',clientSecret);

    const tokenUrl = `${baseUrl}/realms/${realm}/protocol/openid-connect/token`;

    const { data } = await axios.post(
      tokenUrl,
      params,                                 // 👈 qui ora è sempre OK
      { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
    );

    this.accessToken = data.access_token;
    this.expiresAt   = now + data.expires_in * 1000;
    return this.accessToken;
  }
}