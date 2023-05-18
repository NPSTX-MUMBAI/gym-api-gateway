import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddDietDTO } from 'src/member/dto/add-diet.dto';
import { DietService } from './diet.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';

@Controller('diet')
export class DietController {
  constructor(private readonly dietSvc: DietService) {}

  @Post('adddefaultdiet')
  create(@Body() createDietDto: AddDietDTO) {
    return this.dietSvc.addDefaultDiet(createDietDto);
  }

  @Get()
  findAll() {
    // return this.dietSvc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.dietSvc.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDietDto: UpdateDietDto) {
    // return this.dietSvc.update(+id, updateDietDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.dietSvc.remove(+id);
  }
}
