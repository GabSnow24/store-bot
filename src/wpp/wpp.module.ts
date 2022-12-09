import { Module } from '@nestjs/common';
import { WppController } from './wpp.controller';
import { WppService } from './wpp.service';


@Module({
  controllers: [WppController],
  providers: [WppService]
})
export class WppModule { }
