import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { AddDietDTO } from 'src/member/dto/add-diet.dto';

import { UpdateDietDto } from './dto/update-diet.dto';
import { AddMeallDTO } from './dto/add-mill.dto';
import { AddFoodDTO } from './dto/add-food.dto';

@Injectable()
export class DietService {

  constructor(private neo:Neo4jService) {}

  //1
    // async addDefaultDiet(dto:AddDietDTO) {
    //   try {
    //     console.log('Creating Diet');
        
    //     //Get default diet plans
    //     const response = await this.neo.write(`
    //     MATCH (d:Diet) RETURN d;        `)
        

    //     //Create Default Diet Plan
    //     const createDiet = await this.neo.write(`
    //     CREATE (d:Diet {
    //             dietType:"${dto.dietType}", 
    //             breakfast:"${dto.breakfast}",
    //             lunch:"${dto.lunch}",
    //             fruits:"${dto.fruits}",
    //             salad:"${dto.salad}"
    //           })
    //           RETURN d
    //     `)
  
    //     if(createDiet) {
    //       createDiet.map(() => {

    //       })
          
    //     } 
  
    //     return response

    //   } catch (error) {
    //     return {status:'Failed',msg:'Error!'}
    //   }
    // }

    //2
    async addDefaultDiet(dto:AddDietDTO) {
      try {
        console.log('Creating Diet');
        
        let dietId:string;

        //Get default diet plans
        const response = await this.neo.write(`
        MATCH (d:Diet) RETURN d;`)
        

        //Create Default Diet Plan
        const createDefaultDiet = await this.neo.write(`
        CREATE (d:Diet {
                dietId:apoc.create.uuid(),
                dietType:"${dto.dietType}", 
                breakfast:"${dto.breakfast}",
                lunch:"${dto.lunch}",
                fruits:"${dto.fruits}",
                salad:"${dto.salad}"
              })
              RETURN d
        `)
  

        if(createDefaultDiet) {  
          createDefaultDiet.map((res) => {
            dietId = res.d.dietId;
            console.log('Diet Id Is ',dietId);
            
          })

          // this.neo.write(`
          // MATCH (u:User {userId:"${dto.userId}"}),(m:Meal {:"${}"})
          // `)

          
        } 
        return createDefaultDiet;
  

      } catch (error) {
        return {status:'Failed',msg:'Error!'}
      }
    }

    async addMeal(dto:AddMeallDTO) {
      
      try {
        let mealId:string  

        const createMill = await this.neo.write(`
        CREATE (m:Meal {
          mealId:apoc.create.uuid(),
          mealType:"${dto.millType}",
          createdOn:"${Date.now()}",
          userId:"${dto.userId}"
        })
        return m
        `)

        if(createMill) {
          
          createMill.map((res) => {
            mealId = res.m.mealId;
            console.log("Mill ID - ",mealId);
            
          })

          const addMemberDiet = this.neo.write(`
          MATCH (u:User {userId:"${dto.userId}"}),(m:Meal {mealId:"${mealId}"})
          CREATE (u) - [r:HAS_DIET] -> (m)
          return u
          `)



          return addMemberDiet;
        }


      } catch (error) {
        console.log('',error);
        
      }
    }

    async addFood(dto:AddFoodDTO) {
      try {
        let foodId:string

        const createFood = await this.neo.write(`
        CREATE (f:Food {
          foodId:apoc.create.uuid(),
          foodType:"${dto.foodType}",
          foodName:"${dto.foodName}"
        })
        return f;
        `)

        if(createFood) {
          createFood.map((res) => {
            foodId = res.f.foodId;
            console.log('Food Id is ',foodId);
            
          })

         const addMealFood = this.neo.write(`
         MATCH (m:Meal {mealId:"${dto.mealId}"}),(f:Food {foodId:"${foodId}"})
         CREATE (m) - [:CONSIST_OF] -> (f)
         RETURN m
         `) 
          return addMealFood;
        }

        return true;

      } catch (error) {
        console.log('Error',error);
        
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
