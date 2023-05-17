
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
import { ServiceDTO } from 'src/services/dto/service.dto';
import { AssociateSvcDto } from './dto/associateService.dto';
import { ServicesService } from './services.service';
import { log } from 'console';

@Controller('services')
export class ServicesController {
  constructor(private readonly defSvc: ServicesService) { }



  //#1  
  @Post('/generate/default/service') //Running
  async generateDefaultservice(dto: ServiceDTO) {
    console.log('inside generate default service');
    // return await this.defSvc.createDefaultservice(dto);

  }

  //#2
  @Get('getlist')   //Running
  findAll() {
    // return `This action returns all owner`;

    // @Get(':id') //Service Id Getting null
    // findOne(id: string) {
    //   // return `This action returns a #${id} owner`;
    //   return this.defSvc.findServiceById(id);
  }


  @Get(':id')     //Running
  findOne(
    @Param('id') id: string

  ) {
    return this.defSvc.findServiceById(id);
  }

  @Get(':id')     //Running
  findTwo(
    @Param('id') id: string,
  ) {
    return this.defSvc.getServiceByGymId(id);
  }

  //Not Running
  //Service Id Getting null


  @Post('addservice/:id')
  create(
    @Param('id') id: string,
    @Body()
    createServiceDto: ServiceDTO,
    gymDto: CreateGymDto
  ) {
    // return 'This action adds a new owner';

    this.defSvc.addCustomService(id, createServiceDto)

  }

  @Post('/associatesvc')
  async associateServiceWithMember(

    @Body()
    dto: AssociateSvcDto) {
    console.log(dto);
    return await this.defSvc.associateSvcWithMember(dto);
  }


  @Post('deassociatesvc')
  deassociateServiceWithMember(
    @Body()
    dto: AssociateSvcDto
  ) {
    return this.defSvc.deassociateSvcWithMember(dto);

  }



  //Running
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() svcDto: ServiceDTO
  ) {
    return this.defSvc.update(id, svcDto);
  }


  //Running
  // @Delete('remove/service/:id')
  // remove(
  //   @Param('id') id: string) 
  //   {
  //   return this.defSvc.remove(id);
  //   }


}
