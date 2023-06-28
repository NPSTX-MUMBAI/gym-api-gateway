import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ServiceDTO } from 'src/package/dto/service.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

 
  @Get('/generate/default/exercise')

  create(@Body() createExerciseDto: CreateExerciseDto) {

    return this.exercisesService.createDefaultexercise(createExerciseDto);

  }
  @Post('/attachexercisemem')

  async attacsvcmem(@Body() createBody: CreateExerciseDto) {

    return await this.exercisesService.attachExerciseSVC(createBody);

  }

  @Get()
  findAll() {
    return this.exercisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    return this.exercisesService.update(+id, updateExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(+id);
  }
}
