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
import { updateService } from 'src/package/dto/updateservice.dto';
import { AssociateSvcDto } from 'src/package/dto/associateService.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly defSvc: ServicesService) {} //#1

  @Get('/generate/default/service') //Running
  async generateDefaultservice(dto: ServiceDTO) {
    console.log('inside generate default service');

    return await this.defSvc.createDefaultservice();
  } // #2

  @Get('getlist') //Running
  fetchserviceList() {
    // return `This action returns all owner`;

    return this.defSvc.fetchServiceList();
  }

  @Post('/add')
  async create(@Body() createServiceDto: ServiceDTO) {
    // console.log('createServiceDTO=>', createServiceDto);

    return await this.defSvc.createCustomService(createServiceDto);
  }

  @Post('/selectedService')
  async selectServices(@Body() createServiceDto: ServiceDTO) {
    console.log('createServiceDTO=>', createServiceDto);

    return await this.defSvc.selectedServices(createServiceDto);
  }
  @Post('/attachservicemem')

  async attacsvcmem(@Body() createBody: ServiceDTO) {

    return await this.defSvc.attachServicesMEM(createBody);

  }

  @Get(':id')
  async getserviceById(@Param('id') id: any) {
    // return `This action returns a #${id} owner`;

    console.log(`findserviceById ${id}`);

    return await this.defSvc.getServiceByGymId(id);
  }
  @Patch('service/:id')

 async updateService(

 @Param('id') id: string,

@Body() updateservice: updateService,

) {

return await this.defSvc.updateService(id, updateservice);

 }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() svcDto: ServiceDTO) {
    return this.defSvc.update(id, svcDto);
  } //Service Id Getting null

  @Delete('remove/service/:id')
  remove(id: string) {
    return this.defSvc.remove(id);
  }

  @Delete('remove')
  async deleteServiceByGymId(@Body() dto: ServiceDTO) {
    return await this.defSvc.deleteServiceByGymId(dto);
  }

  @Post('/associateService')
  async associateServiceWithGym(
    @Body() body: { gymId: string; svcId: string; rate: number; name: string },
  ) {
    return await this.defSvc.associateServiceWithGym(
      body.gymId,

      body.svcId,

      body.rate,
    );
  }
  @Post('/associatesvc')

  async associateServiceWithMember(

    @Body()

    dto: AssociateSvcDto,

  ) {

    console.log(dto);

    //  return await this.defSvc.associateSvcWithMember(dto);

    return await this.defSvc.associateSvc(dto);

  }
}
