import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddDietDTO } from 'src/member/dto/add-diet.dto';
import { DietService } from './diet.service';
import { AddFoodDTO } from './dto/add-food.dto';
import { AddMeallDTO } from './dto/add-meal.dto';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { updatemealItemsDTO } from './dto/update-mealitems.dto';

@Controller('diet')
export class DietController {
  constructor(private readonly dietSvc: DietService) {}

  @Post('adddefaultdiet')
  create(@Body() createDietDto: AddDietDTO) {
    return this.dietSvc.addDefaultDiet(createDietDto);
  }

  @Post('addmeal')
  add(@Body() createMealDto: AddMeallDTO) {
    return this.dietSvc.addMeal(createMealDto);
  }

  //can be set images of food here
 


  @Get()
  findAll() {
    // return this.dietSvc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.dietSvc.findOne(+id);
  }

  @Patch('/updatemeal')
  update(
    @Body() updateMealDto: updatemealItemsDTO) {
      
    return this.dietSvc.updateMealItems(updateMealDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.dietSvc.remove(+id);
  }
}
