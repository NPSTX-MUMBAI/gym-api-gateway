import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';

import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[
    MulterModule.register({
      dest:'./files',
    })
  ],
  controllers: [KycController],
  providers: [KycService],
  exports:[MulterModule]
  
})
export class KycModule {}
