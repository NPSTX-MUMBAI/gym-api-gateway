import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { AddDietDTO } from 'src/member/dto/add-diet.dto';

import { UpdateDietDto } from './dto/update-diet.dto';

@Injectable()
export class DietService {


  constructor(private neo:Neo4jService) {}

    async addDefaultDiet(dto:AddDietDTO) {
      try {
        console.log('Creating Diet');
        
        //Get default diet plans
        const response = await this.neo.write(`
        MATCH (d:Diet) RETURN d;        `)
  

        //Create Default Diet Plan
        const create = await this.neo.write(`
        CREATE (d:Diet {dietType:"${dto.dietType}", 
                breakfast:"${dto.breakfast}",
                lunch:"${dto.lunch}",
                fruits:"${dto.fruits}",
                salad:"${dto.salad}"
              })
              RETURN d
        `)
  
        if(create) {
          console.log('======',create);
          
        }
  
        return response

      } catch (error) {
        return {status:'Failed',msg:'Error!'}
      }
    }


  findAll() {
    return `This action returns all diet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diet`;
  }

  update(id: number, updateDietDto: UpdateDietDto) {
    return `This action updates a #${id} diet`;
  }

  remove(id: number) {
    return `This action removes a #${id} diet`;
  }
}
