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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboundJwtInterceptor = void 0;
// _shared/keycloak-m2m/src/outbound.interceptor.ts
const common_1 = require("@nestjs/common");
const m2m_service_1 = require("./m2m.service");
let OutboundJwtInterceptor = class OutboundJwtInterceptor {
    constructor(kc) {
        this.kc = kc;
    }
    async intercept(ctx, next) {
        // intercettiamo SOLO le chiamate RPC verso altri micro-servizi
        if (ctx.getType() === 'rpc') {
            const token = await this.kc.getToken();
            /**
             * ctx.getArgs() restituisce lo stesso array che passerà
             * al controller/handler → possiamo sostituire l’elemento 0
             * (per le RPC è il “data” originale).
             */
            const args = ctx.getArgs(); // any[]
            const originalPayload = args[0]; // quello che l’app aveva passato
            args[0] = {
                __accessToken: token,
                payload: originalPayload,
            };
        }
        return next.handle();
    }
};
exports.OutboundJwtInterceptor = OutboundJwtInterceptor;
exports.OutboundJwtInterceptor = OutboundJwtInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [m2m_service_1.KeycloakM2MService])
], OutboundJwtInterceptor);
