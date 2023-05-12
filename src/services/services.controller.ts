import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ServeStaticOptions } from '@nestjs/platform-express/interfaces/serve-static-options.interface';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';
import { ServiceDTO } from 'src/services/dto/service.dto';
import { ServicesService } from './services.service';

@Controller('service')


export class ServicesController {

  constructor(private readonly defSvc: ServicesService) { }
    
  //#1  
  @Post('/generate/default/service') //Running

  async generateDefaultservice(dto:ServiceDTO) {
    console.log('inside generate default service');
    // return await this.defSvc.createDefaultservice(dto);

  }

  //#2
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

  @Get(':id')     //Running
  findTwo(
    @Param('id') id: string,
    ) {
   return this.defSvc.getServiceByGymId(id);
  }



  @Post('addservicewithgym/:id')       
  create(
    @Param('id') id:string,
    @Body() 
    createServiceDto:ServiceDTO,
    gymDto:CreateGymDto
    ) {
    // return 'This action adds a new owner';

      this.defSvc.addService(id,createServiceDto)
    
  }



  //Running
  @Patch('update/:id')
  update(
    @Param ('id') id:string,
    @Body() svcDto:ServiceDTO
  ) {
    return this.defSvc.update(id,svcDto);
  }


  //Running
  @Delete('remove/service/:id')
  remove(
    @Param('id') id: string) 
    {
    return this.defSvc.remove(id);
    }
}
