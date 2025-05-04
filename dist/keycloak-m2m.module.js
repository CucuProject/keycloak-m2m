"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var KeycloakM2MModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakM2MModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const m2m_service_1 = require("./m2m.service");
const outbound_interceptor_1 = require("./outbound.interceptor");
const inbound_guard_1 = require("./inbound.guard");
const inbound_strategy_1 = require("./inbound.strategy");
let KeycloakM2MModule = KeycloakM2MModule_1 = class KeycloakM2MModule {
    /** Chiama always nella root-module del micro-servizio */
    static forRoot() {
        return {
            module: KeycloakM2MModule_1,
            providers: [
                m2m_service_1.KeycloakM2MService,
                inbound_strategy_1.InboundJwtStrategy,
                { provide: core_1.APP_INTERCEPTOR, useClass: outbound_interceptor_1.OutboundJwtInterceptor },
                { provide: core_1.APP_GUARD, useClass: inbound_guard_1.InboundJwtGuard },
            ],
            exports: [m2m_service_1.KeycloakM2MService],
        };
    }
};
exports.KeycloakM2MModule = KeycloakM2MModule;
exports.KeycloakM2MModule = KeycloakM2MModule = KeycloakM2MModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], KeycloakM2MModule);
