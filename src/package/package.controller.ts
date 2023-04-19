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
import { ServiceDTO } from './dto/service.dto';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) { }

  @Post('/create')
  async create(@Body() createPackageDto: CreatePackageDto) {
    return await this.packageService.create(createPackageDto);
  }

  @Post('/addservice')
  createService(@Body() serviceDto: ServiceDTO) {
    return this.packageService.createService(serviceDto);
  }

  //1
  // @Get('')
  // findAll() {
  //   return this.packageService.findAll();
  // }

  @Post('findallPackages')
  findAllpackage(@Body() dto: CreatePackageDto) {
    return this.packageService.findallpackage(dto);
  }

  @Get('allPackages')
  findAll() {
    return this.packageService.findAll();
  }

  @Post(':id')
  findOne(@Param('id') id: string) {
    return this.packageService.findpackagebyId(id);
  }


  // @Get(':id')   //Running
  // findOne(@Param('id') id: string) {
  //   return this.packageService.findpackagebyId(id);
  // }

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

  @Get('/generate/default/service')
  async generateDefaultservice(dto: ServiceDTO) {
    console.log('inside generate default service');
    return await this.packageService.createDefaultservice(dto);

    // return this.packageService.testPService();
  }
}
