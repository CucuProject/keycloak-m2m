// _shared/keycloak-m2m/src/outbound.interceptor.ts
import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler,
} from '@nestjs/common';
import { KeycloakM2MService } from './m2m.service';

@Injectable()
export class OutboundJwtInterceptor implements NestInterceptor {
  constructor(private readonly kc: KeycloakM2MService) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    // intercettiamo SOLO le chiamate RPC verso altri micro-servizi
    if (ctx.getType() === 'rpc') {
      const token = await this.kc.getToken();

      /**
       * ctx.getArgs() restituisce lo stesso array che passerà
       * al controller/handler → possiamo sostituire l’elemento 0
       * (per le RPC è il “data” originale).
       */
      const args = ctx.getArgs();          // any[]
      const originalPayload = args[0];     // quello che l’app aveva passato

      args[0] = {                          // nuovo payload
        __accessToken: token,
        payload: originalPayload,
      };
    }

    return next.handle();
  }
}