<<<<<<< HEAD
import { Controller, Get } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

    // @Post('/create')
    // async create(@Body() createPackageDto: CreatePackageDto) {
    //   return await this.packageService.create(createPackageDto);
    // }

    // @Post('/addservice')
    // createService(@Body() serviceDto: ServiceDTO) {
    //   return this.packageService.createService(serviceDto);
    // }

    //1
    // @Get('')
    // findAll() {
    //   return this.packageService.findAll();
    // }

    // @Post('findallPackages')
    // findAllpackage(@Body() dto: CreatePackageDto) {
    //   return this.packageService.findallpackage(dto);
    // }

    // @Get('allPackages')
    // findAll() {
    //   return this.packageService.findAll();
    // }

    // @Post(':id')
    // findOne(@Param('id') id: string) {
    //   return this.packageService.findpackagebyId(id);
    // }


    // @Get(':id')   //Running
    // findOne(@Param('id') id: string) {
    //   return this.packageService.findpackagebyId(id);
    // }

    // @Get('packagenames')
    // getPackageNamesWithId() {
    //   this.packageService.getPackageNames();
    // }


    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    //   return this.packageService.update(+id, updatePackageDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.packageService.remove(+id);
    // }

    
  @Get('/generate/default/service')
  async generateDefaultservice() {
    console.log('inside generate default service');
    return await this.servicesService.createDefaultservice();

    // return this.packageService.testPService();
  }
=======
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



  @Post('addservice/:id')       
  create(
    @Param('id') id:string,
    @Body() 
    createServiceDto:ServiceDTO,
    gymDto:CreateGymDto
    ) {
    // return 'This action adds a new owner';

      this.defSvc.addCustomService(id,createServiceDto)
    
  }

  @Post('/associatesvc')
  async associateServiceWithMember(
    
    @Body()
    dto:AssociateSvcDto) {
      console.log(dto);
     return await this.defSvc.associateSvcWithMember(dto);
  }


  @Post('deassociatesvc')
  deassociateServiceWithMember(
    @Body()
    dto:AssociateSvcDto
  ) {
    return this.defSvc.deassociateSvcWithMember(dto);

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
  // @Delete('remove/service/:id')
  // remove(
  //   @Param('id') id: string) 
  //   {
  //   return this.defSvc.remove(id);
  //   }


>>>>>>> 903463badc3e04777d22ceff3d6b77434e8a271e
}
