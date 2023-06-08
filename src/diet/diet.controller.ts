import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { AddDietDTO } from 'src/member/dto/add-diet.dto';
import { DietService } from './diet.service';
import { AddFoodDTO } from './dto/add-food.dto';
import { AddMealDTO } from './dto/add-meal.dto';
import { AddDietDTO } from 'src/member/dto/add-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { updatemealItemsDTO } from './dto/update-mealitems.dto';

import { AddCustomDietDTO } from './dto/add-custom-diet.dto';

@Controller('diet')
export class DietController {
  constructor(private readonly dietSvc: DietService) {}


  @Post('addefaultdiet') 
  create(@Body() addDietDTO: AddDietDTO) {
    return this.dietSvc.addDefaultDiet(addDietDTO);
  }

  @Post('addefaultmeal') 
  addDefaultMeal(@Body() addMealDTO: AddMealDTO) {
    return this.dietSvc.addDefaultMeal(addMealDTO);
  }

  @Post('addefaultfood') 
  addDefaultFood(@Body() addFoodDto: AddFoodDTO) {
    return this.dietSvc.addDefaultFood(addFoodDto);
  }  

  //L1
  @Post('adddmemberdiet') 
  addMemberDiet(@Body() addDietDTO: AddDietDTO) {
    return this.dietSvc.adddMemberDiet(addDietDTO);
  }

  //L2
  @Post('adddietmeal') 
  addDietMeal(@Body() addMealDto: AddMealDTO) {
    return this.dietSvc.addDietMeal(addMealDto);
  }

  //L3
  @Post('addmealfood') 
  addMealFood(@Body() addFoodDto: AddFoodDTO) {
    return this.dietSvc.addMealFood(addFoodDto);
  }


   //f1
   @Get('finddiet/:id')
   findDiet(
     @Param('id') id:string
   ) {
     return this.dietSvc.findDiet(id);
   }



  //f2
  @Get('findmeal/:id')
  findMeal(
    @Param('id') id:string
  ) {
    return this.dietSvc.findMeal(id);
  }


  //f3
  @Get('findfooddish/:id')
  findOne(@Param('id') id: string) {

    return this.dietSvc.findFoodItems(id);

  }


  @Get('findmemberdiet')
  findMemberDiet(@Body() addDietDto:AddDietDTO) {
    return this.dietSvc.findMemberiet(addDietDto);
  }


}