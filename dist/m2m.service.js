"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakM2MService = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let KeycloakM2MService = class KeycloakM2MService {
    constructor(cfg) {
        this.cfg = cfg;
        this.accessToken = '';
        this.expiresAt = 0; // epoch ms
    }
    async getToken() {
        const now = Date.now();
        if (now < this.expiresAt - 30_000 && this.accessToken)
            return this.accessToken;
        /* ------------------------------------------------------------
         * 1.  leggi variabili (e fallisci subito se mancano)
         * ---------------------------------------------------------- */
        const realm = this.cfg.get('KC_REALM');
        const baseUrl = this.cfg.get('KC_SERVER_URL');
        const clientId = this.cfg.get('KC_CLIENT_ID');
        const clientSecret = this.cfg.get('KC_CLIENT_SECRET');
        if (!realm || !baseUrl || !clientId || !clientSecret)
            throw new common_1.InternalServerErrorException('KC_* env vars missing (KC_SERVER_URL, KC_REALM, KC_CLIENT_ID, KC_CLIENT_SECRET)');
        /* ------------------------------------------------------------
         * 2.  compila URLSearchParams in modo “type-safe”
         * ---------------------------------------------------------- */
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        const tokenUrl = `${baseUrl}/realms/${realm}/protocol/openid-connect/token`;
        const { data } = await axios_1.default.post(tokenUrl, params, // 👈 qui ora è sempre OK
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        this.accessToken = data.access_token;
        this.expiresAt = now + data.expires_in * 1000;
        return this.accessToken;
    }
};
exports.KeycloakM2MService = KeycloakM2MService;
exports.KeycloakM2MService = KeycloakM2MService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.DEFAULT }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KeycloakM2MService);
