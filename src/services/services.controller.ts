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

    
  @Get('/generate/default/service') //Running

  async generateDefaultservice() {
    console.log('inside generate default service');
    return await this.servicesService.createDefaultservice();

    // return this.packageService.testPService();
  }
}
