import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

@Module({
  controllers: [ServicesController],
<<<<<<< HEAD
  providers: [ServicesService]
=======
  providers: [ServicesService],
  exports:[ServicesService]
>>>>>>> 903463badc3e04777d22ceff3d6b77434e8a271e
})
export class ServicesModule {}
