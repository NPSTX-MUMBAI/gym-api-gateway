import { HttpException, Injectable } from '@nestjs/common';
import { CreateExerciseDto, exerciseType } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Neo4jService } from '@brakebein/nest-neo4j';
import * as crypto from 'crypto';

@Injectable()
export class ExercisesService {
  constructor(private neo: Neo4jService) {}
  create(createExerciseDto: CreateExerciseDto) {
    return 'This action adds a new exercise';
  }

  findAll() {
    return `This action returns all exercises`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exercise`;
  }

  update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return `This action updates a #${id} exercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} exercise`;
  }
  async createDefaultexercise(dto: CreateExerciseDto) {
    try {
      console.log('inside package service');

      const defaultExe: CreateExerciseDto[] = [
        {
          exId: crypto.randomUUID(),

          isDefault: true,

          name: 'Bicep curl',

          imgUrl: '../assets/lockers.jpg',

          exerciseType: [exerciseType.BICEPS],
        },

        {
          exId: crypto.randomUUID(),

          isDefault: true,

          name: 'Hammer curl',

          imgUrl: '../assets/Yoga1.jpg',

          exerciseType: [exerciseType.BICEPS],
        },

        {
          exId: crypto.randomUUID(),

          isDefault: true,

          name: 'Incline dumbbell curl',

          imgUrl: '../assets/cardio1.jpg',

          exerciseType: [exerciseType.BICEPS],
        },

        {
          exId: crypto.randomUUID(),

          isDefault: true,

          name: 'Diamond push up',

          imgUrl: '../assets/Trainer1.jpg',

          exerciseType: [exerciseType.TRICEPS],
        },

        {
          exId: crypto.randomUUID(),

          isDefault: true,

          name: 'Bench dip',

          imgUrl: '../assets/Strengthtraining.jpg',

          exerciseType: [exerciseType.TRICEPS],
        },

        {
          exId: crypto.randomUUID(),

          isDefault: true,

          name: 'Push - down',

          imgUrl: '../assets/swimpool1.jpg',

          exerciseType: [exerciseType.BICEPS],
        },

        {
          exId: crypto.randomUUID(),

          isDefault: true,

          name: 'Bench press',

          imgUrl: '../assets/sauna.jpg',

          exerciseType: [exerciseType.CHEST],
        },

        {
          exId: crypto.randomUUID(),

          isDefault: true,

          name: 'Dumbbell bench press',

          imgUrl: '../assets/sauna.jpg',

          exerciseType: [exerciseType.CHEST],
        },

        {
          exId: crypto.randomUUID(),

          isDefault: true,

          name: 'Dumbbell Flyes',

          imgUrl: '../assets/sauna.jpg',

          exerciseType: [exerciseType.CHEST],
        },
      ];

      defaultExe.forEach(async (exe) => {
        const query = `CREATE (x:Excercise { exId:"${exe.exId}",

      name:"${exe.name}",

      imgUrl:"${exe.imgUrl}",




      createdOn:"${exe.createdOn}",

      exerciseType:"${exe.exerciseType}",

      isDefault:"${exe.isDefault}"}) return x`;

        console.log(query);

        const res = await this.neo.write(query);

        console.log(res);
      });

      console.log('outside loop');

      return {status:true,data:defaultExe };
    } catch (error) {
      console.log(error);

      throw new HttpException(error, 402);
    }
  }
}
