import { ConfigService } from '@nestjs/config';
export declare class KeycloakM2MService {
    private readonly cfg;
    private accessToken;
    private expiresAt;
    constructor(cfg: ConfigService);
    getToken(): Promise<string>;
}
