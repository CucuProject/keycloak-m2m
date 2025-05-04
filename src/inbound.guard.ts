import {
  Injectable, CanActivate, ExecutionContext, UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * Guard usato SOLO per RPC/EventPattern: prende il token già inserito
 * dall’interceptor in `__accessToken` e ne controlla la sintassi.
 * La verifica crittografica è già svolta dalla Strategy.
 */
@Injectable()
export class InboundJwtGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> {
    if (ctx.getType() !== 'rpc') return true;

    const { __accessToken } = ctx.switchToRpc().getData();
    if (!__accessToken) throw new UnauthorizedException('Missing M2M token');

    try {
      jwt.decode(__accessToken, { complete: true });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid M2M token');
    }
  }
}