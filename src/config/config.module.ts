import { Global, Module } from '@nestjs/common';
import { config } from './config';

@Global()
@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: config,
    },
  ],
  exports: ['CONFIG'],
})
export class ConfigModule { }
