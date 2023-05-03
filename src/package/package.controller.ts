import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { ServiceDTO } from '../services/dto/service.dto';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post('/add')
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  //1
  // @Get('')
  // findAll() {
  //   return this.packageService.findAll();
  // }

  // @Post('findallPackages')
  // findallpackage(@Body() dto: CreatePackageDto) {
  //   return this.packageService.findallpackage(dto);
  // }

  // @Get('findallPackages')
  // findallpackage(@Body() dto: CreatePackageDto) {
  //   return this.packageService.findallpackage(dto);
  // }

  @Get('allPackages')  
  findAll(@Param('id') dto:ServiceDTO) {
    return this.packageService.findAll();   //Runnning
    // return this.packageService.getServiceByPackageId(dto);
    // return this.packageService.getPackageList(dto);
  }

  // @Post('findDup')
  // getServiceByPID() {
  //   // this.packageService.getServiceByPackageID();
    
  //  return this.packageService.testIds();
  // }
  
  @Post('getid')
  getFindIDS() {
    return this.packageService.getPackageNames();
  }


  @Get(':id')   //Running
  findOne(@Param('id') id: string) {
    return this.packageService.findpackagebyId(id);
  }

  @Get('packagenames')
  getPackageNamesWithId() {
    this.packageService.getPackageNames();
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(+id, updatePackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(+id);
  }

  // @Post('/generate/default/service')    //Running
  // async generateDefaultservice(dto:ServiceDTO){
  //   console.log('inside generate default service');
  //   // return await this.packageService.createDefaultservice(dto);
  // }
}
