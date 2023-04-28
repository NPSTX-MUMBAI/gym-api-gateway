import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ServeStaticOptions } from '@nestjs/platform-express/interfaces/serve-static-options.interface';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
import { ServiceDTO } from 'src/package/dto/service.dto';
import { ServicesService } from './services.service';

@Controller('services')


export class ServicesController {

  constructor(private readonly defSvc: ServicesService) { }
    
  @Post('/generate/default/service') //Running

  async generateDefaultservice(dto:ServiceDTO) {
    console.log('inside generate default service');
    return await this.defSvc.createDefaultservice(dto);

  }

  @Get('getlist')
  findAll() {
    // return `This action returns all owner`;

   return this.defSvc.findServiceList();
  }

  @Get()
  findOne(id: number) {
    // return `This action returns a #${id} owner`;
    

  }



  @Post()
  create(createServiceDto:ServiceDTO ) {
    return 'This action adds a new owner';
  }

  @Put()
  update(id: number) {
    return `This action updates a #${id} owner`;
  }

  //Working On
  @Delete('remove/service/:id')
  remove(id: string) {
    this.defSvc.remove(id);
  }
}
