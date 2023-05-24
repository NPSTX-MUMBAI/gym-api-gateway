import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { AddDietDTO } from 'src/member/dto/add-diet.dto';

import { UpdateDietDto } from './dto/update-diet.dto';
import { AddMeallDTO } from './dto/add-meal.dto';
import { AddFoodDTO } from './dto/add-food.dto';
import { Workbook } from 'exceljs';
import { updatemealItemsDTO } from './dto/update-mealitems.dto';

@Injectable()
export class DietService {

  constructor(private neo:Neo4jService) {}


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

    async addCustomDiet(dto:AddDietDTO) {
      try {
        //Take UserID & DietID
        const check = await this.neo.read(`
        MATCH p = (u:User {userId:"${dto.userId}"}) - [:HAS_DIET] - (d:Diet {dietId:"${dto.dietId}"})
        RETURN p     
        `)
        if(check.length > 0) {
          console.log('Already Diet is Present with this User!');
          
        } else {
          let dietId:string
          const add = this.neo.write(`
          MATCH p=(u:User {userId:"${dto.userId}"}),(d:Diet {dietId:"${dto.dietId}"}) 
          CREATE (u) - [:HAS_DIET] -> (d)
          RETURN p
          
          `)

        }
      
      } catch (error) {
        
      }
    }

    async addMeal(dto:AddMeallDTO) {
      
      //1 Create Meal first with mealType


      try {
        let mealId:string  

        const createMill = await this.neo.write(`
        CREATE (m:Meal {
          mealId:apoc.create.uuid(),
          mealType:"${dto.mealType}",
          createdOn:"${Date.now()}",
          userId:"${dto.userId}"
        })
        return m
        `)

        if(createMill) {
          
          createMill.map((res) => {
            mealId = res.m.mealId;
            console.log("Meal ID - ",mealId);
            
          })


          // 2 Dont Use this for single mapping purpose
          const addMemberDiet = this.neo.write(`
          MATCH (u:User {userId:"${dto.userId}"}),(m:Meal {mealId:"${dto.mealId}"})
          CREATE (u) - [r:HAS_DIET] -> (m)
          return u
          `)



          return addMemberDiet;
        }


      } catch (error) {
        console.log('',error);
        
      }
    }

    attachFoodToMeal() {
      try {
        
      } catch (error) {
        
      }
    }

    // foodType:"${dto.foodType}",
    // async addFood(dto:AddFoodDTO) {
    //   try {
    //     let foodId:string

    //     const createFood = await this.neo.write(`
    //     CREATE (f:Food {
    //       foodId:apoc.create.uuid(),
    //       foodName:"${dto.foodName}",
    //       description:"${dto.description}",

    //       calories:"${dto.calories}",
    //       serving_size_g:"${dto.serving_size_g}",
    //       fat_total_g:"${dto.fat_total_g}",
    //       fat_saturated_g:"${dto.fat_saturated_g}",
    //       protein_g:"${dto.protein_g}",
    //       sodium_mg:"${dto.sodium_mg}",
    //       potassium_mg:"${dto.potassium_mg}",
    //       cholesterol_mg:"${dto.cholesterol_mg}",
    //       carbohydrates_total_g:"${dto.carbohydrates_total_g}",
    //       fiber_g:"${dto.fiber_g}",
    //       sugar_g:"${dto.sugar_g}"

    //     })
    //     return f;
    //     `)

    //     if(createFood) {
    //       createFood.map((res) => {
    //         foodId = res.f.foodId;
    //         console.log('Food Id is ',foodId);
            
    //       })

    //      const addMealFood = this.neo.write(`
    //      MATCH (m:Meal {mealId:"${dto.mealId}"}),(f:Food {foodId:"${foodId}"})
    //      CREATE (m) - [:CONSIST_OF] -> (f)
    //      RETURN m
    //      `) 
    //       return addMealFood;
    //     }

    //     return true;

    //   } catch (error) {
    //     console.log('Error',error);
        
    //   }
    // }

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



    //Wrong
    // async updateMealItems(dto:updatemealItemsDTO) {
    //   try {

    //   const updateFood = this.neo.write(`
    //   MATCH (m:Meal {mealId:"${dto.mealId}"}) - 
    //   [:CONSIST_OF] - 
    //   (f:Food {foodId:"${dto.foodId}"}) 
    //   SET f.foodType="${dto.foodType}",
    //       f.foodName = "${dto.foodName}"
    //   RETURN f
    //   `)
    // return updateFood;      
    //   } catch (error) {
        
    //     throw new NotFoundException('Error')
    //   }
    // }


  findMeal(id:string) {
    const r1 =  this.neo.read(`
    MATCH (m:Meal {mealId:"${id}"})
    RETURN m
    `)
    

  }


  findMealFoodItem(id:string) {
    const r1 = this.neo.read(`
    MATCH (f:Food {foodId:"${id}"})
    RETURN f
    `)
    

  }



  findFoodItems(id: string) {
    return `This action returns a #${id} diet`;
  }

  update(id: number, updateDietDto: UpdateDietDto) {
    return `This action updates a #${id} diet`;
  }

  // remove(id: string) {

  //   try {
  //     console.log('Removing...');
      
  //     const w1 = this.neo.write(`
  //     MATCH (f:Food {foodId:"${id}"})
  //     DETACH DELETE f;
  //     `)
  //     return w1;
  //   } catch (error) {
  //     throw new NotFoundException('');
  //   }
  // }

  remove(id:string) {
    try {
      console.log('......');
      
      const r1 = this.neo.read(`
      MATCH (f:Food {foodId:"${id}"})
      return f
      `)
      return r1;
    } catch (error) {
      
    }
  }
  
}

