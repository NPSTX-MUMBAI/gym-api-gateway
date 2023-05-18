import { Module } from '@nestjs/common';
import { DietService } from './diet.service';
import { DietController } from './diet.controller';



@Module({
  imports:[],
  controllers: [DietController],
  providers: [DietService],
})
export class DietModule {}
