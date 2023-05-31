import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ServeStaticOptions } from '@nestjs/platform-express/interfaces/serve-static-options.interface';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';
import { ServiceDTO } from 'src/services/dto/service.dto';
import { AssociateSvcDto } from './dto/associateService.dto';
import { ServicesService } from './services.service';

@Controller('services')


export class ServicesController {

  constructor(private readonly defSvc: ServicesService) { }
    
  @Post('/generate/default/service') //Running

  async generateDefaultservice(dto:ServiceDTO) {
    console.log('inside generate default service');
    return await this.defSvc.createDefaultservice(dto);

  }

  @Post('addcustomservice/')       
  create(
    @Body() 
    createServiceDto:ServiceDTO) {
    // return 'This action adds a new owner';

      return this.defSvc.addCustomService(createServiceDto)
    
  }


  @Get('getlist')   //Running
  findAll() {
    // return `This action returns all owner`;

   return this.defSvc.findServiceList();
  }

  @Get(':id')     //Running
  findOne(
    @Param('id') id: string
    
    ) { 
   return this.defSvc.findServiceById(id);
  }

  @Post('service/:id')     //Running
  async findTwo(@Param('userId') memberId:any) {
  //  return this.defSvc.getServiceByGymId(id); 
  return await this.defSvc.getServiceByMember(memberId);
  }

  @Post('findservice')
  async findService(
    @Body() dto:AssociateSvcDto) {
   return this.defSvc.getServiceByMember(dto)
  }
  
  


  



  @Post('/associatesvc')
  async associateServiceWithMember(
    
    @Body()
    dto:AssociateSvcDto) {
      console.log(dto);
    //  return await this.defSvc.associateSvcWithMember(dto);
     return await this.defSvc.associateSvc(dto);
  }


  @Post('deassociatesvc')
  deassociateServiceWithMember(
    @Body()
    dto:AssociateSvcDto
  ) {
    return this.defSvc.deassociateSvcWithMember(dto);

  }
  
  

  //update1
  @Patch('updatesvcrate')
  update(
    @Body() svcDto:ServiceDTO
  ) {
    return this.defSvc.updateRate(svcDto);
  }


  //update2 WOP
  // @Patch('updatesbscrate')
  // updateSubscriptionrate(
  //   @Body() svcDto:ServiceDTO
  // ) {
  //   return this.defSvc.updateSubscriptionRate(svcDto)
  // }

  //Running
  // @Delete('remove/service/:id')
  // remove(
  //   @Param('id') id: string) 
  //   {
  //   return this.defSvc.remove(id);
  //   }


}
