import { AddDietDTO } from "src/member/dto/add-diet.dto";
import { Neo4jService } from "nest-neo4j/dist";
import { HttpServer } from "@nestjs/common";

export class CreateDietDto {


    constructor(
        private neo:Neo4jService,
        private http:HttpServer
        ) {}


    async addDefaultDiet(dto:AddDietDTO) {
        try {
          
          const response = await this.neo.write(`
          MATCH (d:Diet) RETURN d;
          `)
    
          const create = await this.neo.write(`
          CREATE (d:Diet {dietType:"${dto.dietType}", 
                  breadfast:"${dto.breakfast}",
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



      }

