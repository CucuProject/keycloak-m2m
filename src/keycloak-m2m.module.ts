import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';

import { KeycloakM2MService } from './m2m.service';
import { OutboundJwtInterceptor } from './outbound.interceptor';
import { InboundJwtGuard } from './inbound.guard';
import { InboundJwtStrategy } from './inbound.strategy';

@Global()
@Module({
  providers: [
    KeycloakM2MService,
    InboundJwtStrategy,
    { provide: APP_INTERCEPTOR, useClass: OutboundJwtInterceptor },
    { provide: APP_GUARD,       useClass: InboundJwtGuard },
  ],
  exports: [KeycloakM2MService],
})
export class KeycloakM2MModule {}