import { CanActivate, ExecutionContext } from '@nestjs/common';
/**
 * Guard usato SOLO per RPC/EventPattern: prende il token già inserito
 * dall’interceptor in `__accessToken` e ne controlla la sintassi.
 * La verifica crittografica è già svolta dalla Strategy.
 */
export declare class InboundJwtGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean | Promise<boolean>;
}
