import { Global, Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PoliciesGuard } from './guards/policies.guard';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  providers: [
    CaslAbilityFactory,
    {
      provide: APP_GUARD,
      useFactory: (
        reflector: Reflector,
        caslAbilityFactory: CaslAbilityFactory
      ) => {
        return new PoliciesGuard(reflector, caslAbilityFactory);
      },
      inject: [Reflector, CaslAbilityFactory],
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => {
        return new RolesGuard(reflector);
      },
      inject: [Reflector],
    },
  ],
  exports: [CaslAbilityFactory],
})
export class AuthorizationModule {}
