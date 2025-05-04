import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const InboundJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
/**
 * Strategy “kc-m2m” che verifica la firma RS256 sul token M2M.
 * **Non** restituisce un utente: se il token è valido → passa.
 */
export declare class InboundJwtStrategy extends InboundJwtStrategy_base {
    constructor(cfg: ConfigService);
    validate(payload: any): any;
}
export {};
