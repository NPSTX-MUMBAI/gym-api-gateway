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
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';
import { ServiceDTO, serviceType } from 'src/services/dto/service.dto';
import { AssociateSvcDto } from './dto/associateService.dto';
import { updateServiceDto } from './dto/updateService.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly defSvc: ServicesService) {}

  //1
  @Post('/generate/default/service') //Running
  async generateDefaultservice(dto: ServiceDTO) {
    console.log('inside generate default service');
    return await this.defSvc.createDefaultservice(dto);
  }

  //2
  @Post('addcustomservice/')
  create(
    @Body()
    createServiceDto: ServiceDTO,
  ) {
    // return 'This action adds a new owner';

    return this.defSvc.addCustomService(createServiceDto);
  }

  //3
  @Post('/associatesvc')
  async associateServiceWithMember(
    @Body()
    dto: AssociateSvcDto,
  ) {
    console.log(dto);
    //  return await this.defSvc.associateSvcWithMember(dto);
    return await this.defSvc.associateSvc(dto);
  }

  //4
  @Post('deassociatesvc')
  deassociateServiceWithMember(
    @Body()
    dto: AssociateSvcDto,
  ) {
    return this.defSvc.deassociateSvc(dto);
  }

  //5
  @Patch()
  updateGymServiceRate(@Body() updateSvcDto: updateServiceDto) {
    return this.defSvc.updateGymSvcRate(updateSvcDto);
  }

   //6 
   @Get('findservice')
   async findService(@Body() dto: AssociateSvcDto) {
     return this.defSvc.getServiceByMember(dto);
   }


  //7 
  @Get('getlist') //Running
  findAll() {
    // return `This action returns all owner`;

    return this.defSvc.findServiceList();
  }

  //8
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.defSvc.findServiceById(id);
  }

  
  //9
  //Removing the Total Service Node
  @Delete('remove/service/:id')
  remove(@Param('id') id: string) {
    return this.defSvc.remove(id);
  }

  // findActiveServices() {}
}
