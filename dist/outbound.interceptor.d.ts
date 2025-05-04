import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { KeycloakM2MService } from './m2m.service';
export declare class OutboundJwtInterceptor implements NestInterceptor {
    private readonly kc;
    constructor(kc: KeycloakM2MService);
    intercept(ctx: ExecutionContext, next: CallHandler): Promise<import("rxjs").Observable<any>>;
}
