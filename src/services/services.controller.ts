import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ServeStaticOptions } from '@nestjs/platform-express/interfaces/serve-static-options.interface';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
import { ServiceDTO } from 'src/package/dto/service.dto';
import { ServicesService } from './services.service';
import { log } from 'console';

@Controller('services')
export class ServicesController {
  constructor(private readonly defSvc: ServicesService) {}

  //#1
  @Post('/generate/default/service') //Running
  async generateDefaultservice(dto: ServiceDTO) {
    console.log('inside generate default service');
    return await this.defSvc.createDefaultservice(dto);
  }

  //#2
  @Get('getlist') //Running
  findAll() {
    // return `This action returns all owner`;

    return this.defSvc.findServiceList();
  }

  // @Get(':id') //Service Id Getting null
  // findOne(id: string) {
  //   // return `This action returns a #${id} owner`;
  //   return this.defSvc.findServiceById(id);
  // }

  @Post('/add')
  async create(@Body() createServiceDto: ServiceDTO) {
    console.log('createServiceDTO=>', createServiceDto);
    return await this.defSvc.createCustomService(createServiceDto);
  }

  @Post('/selectedService')
  async selectServices(@Body() createServiceDto: ServiceDTO) {
    console.log('createServiceDTO=>', createServiceDto);
    return await this.defSvc.selectedServices(createServiceDto);
  }

  @Get(':id')
  findserviceById(id: string) {
    // return `This action returns a #${id} owner`;
    return this.defSvc.findServiceByGymId(id);
  }

  //Not Running
  //Service Id Getting null

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() svcDto: ServiceDTO) {
    return this.defSvc.update(id, svcDto);
  }

  //Service Id Getting null
  @Delete('remove/service/:id')
  remove(id: string) {
    return this.defSvc.remove(id);
  }

  @Delete('remove')
  async deleteServiceByGymId(@Body() dto: ServiceDTO) {
    return await this.defSvc.deleteServiceByGymId(dto);
  }
}
