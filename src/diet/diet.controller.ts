import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { AddDietDTO } from 'src/member/dto/add-diet.dto';
import { DietService } from './diet.service';
import { AddFoodDTO } from './dto/add-food.dto';
import { AddMeallDTO } from './dto/add-meal.dto';
import { AddDietDTO } from 'src/member/dto/add-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { updatemealItemsDTO } from './dto/update-mealitems.dto';
import { AddCustomDietDTO } from './dto/add-custom-diet.dto';

@Controller('diet')
export class DietController {
  constructor(private readonly dietSvc: DietService) {}

  @Post('adddefaultdiet') 
  create(@Body() addDietDTO: AddDietDTO) {
    return this.dietSvc.addDefaultDiet(addDietDTO);
  }

  @Post('addmeal')
  add(@Body() createMealDto: AddMeallDTO) {
    return this.dietSvc.addMeal(createMealDto);
  }

  @Post('addfood')
  addFood(
    @Body() createFoodDTO: AddFoodDTO) {
    return this.dietSvc.addFood(createFoodDTO);
  }

  //can be set images of food here
 

  @Post('addcustomdiet')
  addCustomDiet(
    @Body()
      dto:AddCustomDietDTO
  ) {
    return this.dietSvc.addCustomDiet(dto)
  }



  @Get('findmeal/:id')
  findMeal(
    @Param('id') id:string
  ) {
    return this.dietSvc.findMeal(id);
  }

  @Get('findfooditem/:id')
  findOne(@Param('id') id: string) {

    return this.dietSvc.findMealFoodItem(id);

  }

  //Wrong 
  // @Patch('/updatemeal')
  // update(
  //   @Body() updateMealDto: updatemealItemsDTO) {

  //   return this.dietSvc.updateMealItems(updateMealDto);
  // }

  @Delete('diet/removeitem/:id')
  remove(
    @Param('id') id:string
  ) {
    this.dietSvc.remove(id);
  }



}
