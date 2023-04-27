import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ServeStaticOptions } from '@nestjs/platform-express/interfaces/serve-static-options.interface';
import { ServiceDTO } from 'src/package/dto/service.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }
    
  @Post('/generate/default/service') //Running

  async generateDefaultservice(dto:ServiceDTO) {
    console.log('inside generate default service');
    return await this.servicesService.createDefaultservice(dto);

  }

  @Get()
  findAll() {
    return `This action returns all owner`;
  }

  @Get()
  findOne(id: number) {
    return `This action returns a #${id} owner`;
  }

  @Post()
  create(createServiceDto:ServiceDTO ) {
    return 'This action adds a new owner';
  }

  @Put()
  update(id: number) {
    return `This action updates a #${id} owner`;
  }

  @Delete()
  remove(id: number) {
    return `This action removes a #${id} owner`;
  }
}
