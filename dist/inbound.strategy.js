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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
/**
 * Strategy “kc-m2m” che verifica la firma RS256 sul token M2M.
 * **Non** restituisce un utente: se il token è valido → passa.
 */
let InboundJwtStrategy = class InboundJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'kc-m2m') {
    constructor(cfg) {
        const issuer = `${cfg.get('KC_SERVER_URL')}/realms/${cfg.get('KC_REALM')}`;
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: cfg.get('KC_CLIENT_ID'),
            issuer,
            algorithms: ['RS256'],
            secretOrKeyProvider: jwks_rsa_1.default.expressJwtSecret({
                jwksUri: `${issuer}/protocol/openid-connect/certs`,
                cache: true,
                cacheMaxEntries: 5,
                cacheMaxAge: 10_000,
            }), // jwks-rsa type mismatch, cast for TS
        });
    }
    validate(payload) {
        // se arriviamo qui il token è valido → possiamo arricchire req.user se serve
        return payload;
    }
};
exports.InboundJwtStrategy = InboundJwtStrategy;
exports.InboundJwtStrategy = InboundJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_1.ConfigService)),
    __metadata("design:paramtypes", [config_1.ConfigService])
], InboundJwtStrategy);
