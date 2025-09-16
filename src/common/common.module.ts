import { Global, Module } from '@nestjs/common';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';

@Global()
@Module({
  providers: [SerializeInterceptor],
  exports: [SerializeInterceptor],
})
export class CommonModule { }
