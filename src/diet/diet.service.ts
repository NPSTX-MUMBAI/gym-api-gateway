import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { AddDietDTO } from 'src/member/dto/add-diet.dto';

import { UpdateDietDto } from './dto/update-diet.dto';
import { AddMealDTO } from './dto/add-meal.dto';
import { AddFoodDTO } from './dto/add-food.dto';
import { Workbook } from 'exceljs';
import { updatemealItemsDTO } from './dto/update-mealitems.dto';
import { stringify } from 'querystring';
import { networkInterfaces } from 'os';

@Injectable()
export class DietService {
  constructor(private neo: Neo4jService) {}

  async addDefaultDiet(dto: AddDietDTO) {
    try {
      console.log('Creating Custom Diet...');

      let dietId: string;

      //Get default diet plans
      const response = await this.neo.write(`
      MATCH (d:Diet) RETURN d;`);

      //Create Default Diet Plan

      const createDefaultDiet = await this.neo.write(`
      CREATE (d:Diet {
              dietId:apoc.create.uuid(),
              dietType:"${dto.dietType}"
            })
            RETURN d
      `);

      if (createDefaultDiet) {
        createDefaultDiet.map((res) => {
          dietId = res.d.dietId;
          console.log('Diet Id Is ', dietId);
        });
      }
      return createDefaultDiet;
    } catch (error) {
      return { status: 'Failed', msg: 'Error!' };
    }
  }

  async addDefaultMeal(dto: AddMealDTO) {
    try {
      console.log('Creating Custom Meal...');

      let mealId: string;

      //Get default diet plans
      const response = await this.neo.write(`
      MATCH (m:Meal) RETURN m;`);

      //Create Default Diet Plan

      const createDefaultMeal = await this.neo.write(`
      CREATE (m:Meal {
              mealId:apoc.create.uuid(),
              mealType:"${dto.mealType}"
            })
            RETURN m
      `);

      if (createDefaultMeal) {
        createDefaultMeal.map((res) => {
          mealId = res.m.mealId;
          console.log('Meal Id Is ', mealId);
        });
      }
      return createDefaultMeal;
    } catch (error) {
      return { status: 'Failed', msg: 'Error!' };
    }
  }

  async addDefaultFood(dto: AddFoodDTO) {
    try {
      console.log('Creating Custom Food...');

      let foodId: string;

      //Get default diet plans
      const response = await this.neo.write(`
      MATCH (f:Food) RETURN f;`);

      //Create Default Diet Plan

      const createDefaultFood = await this.neo.write(`
      CREATE (f:Food {
              foodId:apoc.create.uuid(),
              foodType:"${dto.foodType}",
              foodName:"${dto.foodName}"
            })
            RETURN f
      `);

      if (createDefaultFood) {
        createDefaultFood.map((res) => {
          foodId = res.f.foodId;
          console.log('Food Id Is ', foodId);
        });
      }
      return createDefaultFood;
    } catch (error) {
      return { status: 'Failed', msg: 'Error!' };
    }
  }

  //1 Member <-> Diet
  async adddMemberDiet(dto: AddDietDTO) {
    try {
      //Take UserID & DietID
      const check = await this.neo.read(`
      MATCH p = (u:User {userId:"${dto.userId}"}) - [:FOLLOWS] - (d:Diet {dietId:"${dto.dietId}"})
      RETURN p     
      `);
      if (check.length > 0) {
        console.log('Already Diet is Present with this User!');
      } else {
        console.log('Adding Member - Diet');

        let dietId: string;
        const add = this.neo.write(`
        MATCH p=(u:User {userId:"${dto.userId}"}),(d:Diet {dietId:"${dto.dietId}"}) 
        CREATE (u) - [:FOLLOWS] -> (d)
        RETURN p
        
        `);
      }
    } catch (error) {}
  }


 
  //2 Diet <-> Meal
  async addDietMeal(dto: AddMealDTO) {
    try {
      //Take UserID & DietID
      const check = await this.neo.read(`
      MATCH p = (d:Diet {dietId:"${dto.dietId}"}) - [:PROVIDES] - (m:Meal {mealId:"${dto.mealId}"})
      RETURN p     
      `); 
      if (check.length > 0) {
        console.log('Already Diet is Present with this User!');
      } else {
        console.log('Adding Diet - Meal');

        let mealId: string;
        const add = this.neo.write(`
        MATCH p =(d:Diet {dietId:"${dto.dietId}"}),(m:Meal {mealId:"${dto.mealId}"}) 
        CREATE (d) - [:PROVIDES] -> (m)
        RETURN p
        
        `);
      }
    } catch (error) {}
  }

  //3 Meal <-> Food
  async addMealFood(dto: AddFoodDTO) {
    try {
      //Take Meal & Food
      const check = await this.neo.read(`
      MATCH p = (m:Meal {mealId:"${dto.mealId}"}) - [:CONSIST_OF] - (f:Food {foodId:"${dto.foodId}"})
      RETURN p     
      `);
      if (check.length > 0) {
        console.log('Already Food is Present with this Meal!');
      } else {
        console.log('Adding Meal - Food');

        let mealId: string;
        const add = this.neo.write(`
        MATCH p =(m:Meal {mealId:"${dto.mealId}"}),(f:Food {foodId:"${dto.foodId}"}) 
        CREATE (m) - [:CONSIST_OF] -> (f)
        RETURN p
        
        `);
      }
    } catch (error) {}
  }


  findMeal(id: string) {
    const r1 = this.neo.read(`
    MATCH (m:Meal {mealId:"${id}"})
    RETURN m
    `);
  }

  
  findDiet(id: string) {
    const r1 = this.neo.read(`
    MATCH (d:Diet {dietId:"${id}"})
    RETURN d
    `);
  }
  

  findFoodItems(id: string) {
    const r1 = this.neo.read(`
    MATCH (f:Food {foodId:"${id}"})
    RETURN f
    `);
  }


  async findMemberiet(dto:AddDietDTO) {
    try {
      console.log('Finding The Member Diet Plan');
      

      const gymMember = await this.neo.read(`
      MATCH p = (g:Gym {gymId:"${dto.gymId}"}) - [:HAS_MEMBER] - (u:User {userId:"${dto.userId}"})
      RETURN p
      `)

      if(gymMember.length > 0) {
        const memberDiet = await this.neo.read(`
        MATCH p = (u:User {userId:"${dto.userId}"}) - 
        [:FOLLOWS] - (d:Diet {dietId:"${dto.dietId}"})
        RETURN p
        `)

          if(memberDiet.length > 0) {
            const dietMeal = await this.neo.read(`
            MATCH p = (d:Diet {dietId:"${dto.dietId}"}) - 
            [PROVIDES] - (m:Meal (mealId:"${dto.mealId}"))
            RETURN p
            `)

            if(dietMeal.length > 0) {
              const mealFood = this.neo.read(`
              MATCH p = (m:Meal (mealId:"${dto.mealId}")) - 
              [:CONSIST_OF] - (f:Food (foodId:"${dto.foodId}"))
              RETURN p
              `)
            }

          }

      } 


      
    } catch (error) {
      throw new NotFoundException('')
    }
  }

}
