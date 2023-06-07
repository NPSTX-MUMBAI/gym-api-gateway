import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '@brakebein/nest-neo4j';

import * as crypto from 'crypto';
import { identity, NotFoundError } from 'rxjs';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';
import { ServiceDTO, serviceType } from 'src/services/dto/service.dto';
import { AssociateSvcDto } from './dto/associateService.dto';
import { updateServiceDto } from './dto/updateService.dto';

@Injectable()
export class ServicesService {
  constructor(private neo: Neo4jService) {}

        

    //By Chandan Sir
    // async associateSvcWithMember(dto:AssociateSvcDto) {
    //   try {

    //     dto.services.map(async (service)=>{
    //       const res = await this.neo.write(`MATCH (u:User {userId:"${dto.memberId}"}),
    //       (s:Service {svcId:"${service.svcId}"}) 
    //       MERGE (u)-[r:SUBSCRIBED_TO {subscriptionDate:"${Date.now()}", 
    //       rate:"${service.rate}"}]->(s) return r
    //      `).then((res) => {
    //       console.log("=====",res);
          
    //      })
    //     })

    //     return {status:true, data:null, msg:'all association done successfully'}
        
    //   } catch (error) {
    //     console.log(error);
    //     return {status:false, data:error, msg:'failed due to technical error'}
        
    //   }
    // }



  // 0.1
  // async createDefaultservice() {
  //   try {
  //     console.log('inside package service');
  //     const defaultSvcs: any[] = [
  //       {
  //         id: crypto.randomUUID(),
  //         isDefault: true,
  //         name: 'Cardio',
  //         imgUrl: '../assets/cardio1.jpg',
  //       },
  //       {
  //         id: crypto.randomUUID(),
  //         isDefault: true,
  //         name: 'Personal Training',
  //         imgUrl: '../assets/Trainer1.jpg',
  //       },
  //       {
  //         id: crypto.randomUUID(),
  //         isDefault: true,
  //         name: 'Sauna',
  //         imgUrl: '../assets/sauna.jpg',
  //       },
  //       {
  //         id: crypto.randomUUID(),
  //         isDefault: true,
  //         name: 'Swimming',
  //         imgUrl: '../assets/swimpool1.jpg',
  //       },
  //       {
  //         id: crypto.randomUUID(),
  //         isDefault: true,
  //         name: 'Strength Training',
  //         imgUrl: '../assets/Strengthtraining.jpg',
  //       },
  //       {
  //         id: crypto.randomUUID(),
  //         isDefault: true,
  //         name: 'Locker',
  //         imgUrl: '../assets/lockers.jpg',
  //       },
  //       {
  //         id: crypto.randomUUID(),
  //         isDefault: true,
  //         name: 'Yoga',
  //         imgUrl: '../assets/Yoga1.jpg',
          
  //       },

  //     ];

  //     defaultSvcs.forEach(async (svc) => {
  //       const query = `CREATE (s:Service { id:"${svc.id}",
  //     name:"${svc.name}",
  //     imgUrl:"${svc.imgUrl}",
  //     isDefault:"${svc.isDefault}"}) return s`;
  //       console.log(query);
  //       const res = await this.neo.write(query);
  //       console.log(res);
  //     });

  //     console.log('outside loop');
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     throw new HttpException(error, 402);
  //   }
  // }

  
  //1
  
  
  async createDefaultservice(dto: ServiceDTO) {
    try {
      console.log('inside package service');
      const defaultSvcs: ServiceDTO[] = [
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Lockers',
          imgUrl: '../assets/lockers.jpg',
          serviceType: [serviceType.RECURRING],
          isActive:'True',
          createdOn:`${new Date()}`
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Yoga',
          imgUrl: '../assets/Yoga1.jpg',
          serviceType: [serviceType.INSTANCE],
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Cardio',
          imgUrl: '../assets/cardio1.jpg',
          serviceType: [serviceType.RECURRING],
          isActive:'True',
          createdOn:`${new Date()}`

        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Personal Training',
          imgUrl: '../assets/Trainer1.jpg',
          serviceType: [serviceType.RECURRING],
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Strength Training',
          imgUrl: '../assets/Strengthtraining.jpg',
          serviceType: [serviceType.INSTANCE],
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Swimming',
          imgUrl: '../assets/swimpool1.jpg',
          serviceType: [serviceType.INSTANCE],
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Sauna',
          imgUrl: '../assets/sauna.jpg',
          serviceType: [serviceType.RECURRING],
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'HIT Service',
          imgUrl: '../assets/sauna.jpg',
          serviceType: [serviceType.INSTANCE],
          isActive:'yes',
          createdOn:`${new Date()}`

        },
        
      ];

      defaultSvcs.forEach(async (svc) => {

        const query = `CREATE (s:Service { svcId:"${svc.svcId}",
        isDefault:"${svc.isDefault}",
        isActive:"${svc.isActive}",
        name:"${svc.name}",
        imgUrl:"${svc.imgUrl}",
        createdOn:"${svc.createdOn}",
        isDefault:"${svc.isDefault}"}) return s`;
        console.log(query);
        const res = await this.neo.write(query);
        console.log(res);
      });

      console.log('outside loop');
      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 402);
    }
  }

  //2
  async addCustomService(svcDto: ServiceDTO) {
    let svcId: string;

    const createSvc = await this.neo.write(`
      CREATE (s:Service {
        svcId:apoc.create.uuid(),
        name : "${svcDto.name}",
         isDefault: "${svcDto.isDefault}",
         svcType: "${svcDto.serviceType}",
         isActive:"${svcDto.isActive}",
         createdOn: "${new Date()}"
        })
        return s
        `);
        console.log(createSvc);
        
    createSvc.map((res) => {
      svcId = res.s.svcId;

      console.log('Service Created with Service ID ', svcId);
    });

  }


      //3
      // async associateSvc(dto:AssociateSvcDto) {
      //   try {
      //     dto.services.map(async (service)=>{
      //       const res = await this.neo.write(`MATCH (u:User {userId:"${dto.userId}"}),
      //       (s:Service {svcId:"${service.svcId}"}) 
      //       MERGE (u)-[r:SUBSCRIBED_TO {subscriptionDate:"${Date.now()}", 
      //       rate:"${service.rate}"}]->(s) return r
      //      `).then((res) => {
      //       console.log("=====",res);
      //      })
      //     })
      //     return {status:true, data:null, msg:'all association done successfully'}
      //   } catch (error) {
      //     console.log(error);
      //     return {status:false, data:error, msg:'failed due to technical error'}
      //   }
      // }

        //3.1
        async associateSvc(dto:AssociateSvcDto) {
          try {


            const check = await this.neo.read(`
            MATCH (g:Gym {gymId:"${dto.gymId}"}) - [:HAS_SERVICE] - (s:Service {svcId:"${dto.svcId}"})
            RETURN s;
            `)

            if(check.length > 0) {
              console.log('Service Is Available');
              
              dto.services.map(async (service)=>{
                const res = await this.neo.write(`MATCH (u:User {userId:"${dto.userId}"}),
                (s:Service {svcId:"${service.svcId}"}) 
                MERGE (u)-[r:SUBSCRIBED_TO {subscriptionDate:"${Date.now()}", 
                rate:"${service.rate}"}]->(s) return r
                `).then((res) => {
                  console.log("=====",res);
                })
              })
              return {status:true, data:null, msg:'all association done successfully'}
            } 
              else {
                console.log('Gym Does Not Provide Required Service');
                return 'Gym Does Not Provide Required Service'
              }
            } catch (error) {
              console.log(error);
              return {status:false, data:error, msg:'failed due to technical error'}
            }
            

        }

         //4
     async deassociateSvc(dto:AssociateSvcDto) {
      console.log('Deassociation starts...');
      
      try {
        const selectService = this.neo.read(`
        MATCH (u:User {userId:"${dto.memberId}"})
        RETURN u
        `)

        const r2 = this.neo.write(`
        MATCH (u:User {userId:"${dto.memberId}"}) - [r:SUBSCRIBED_TO] - (s:Service {svcId:"${dto.services[0].svcId}"})
        DETACH DELETE r
        
        `)
        return r2

      } catch (error) {
        console.log('',error);
        
      }
    }

     //5
  //Use GymID,SvcId & UserId
  async updateGymSvcRate(dto:updateServiceDto) {
    try {
      const updateRate = await this.neo.write(`
      MATCH p = (g:Gym {gymId:"${dto.gymId}"}) - [r:HAS_SERVICE] - (s:Service {svcId:"${dto.svcId}"}) 
      SET r.rate = "${dto.rate}" 
      RETURN r
      `)
      if(updateRate) {
        console.log('Updating...');
        const w1 = this.neo.write(`
        MATCH p = (u:User {userId:"${dto.userId}"}) - [r:SUBSCRIBED_TO] - (s:Service {svcId:"${dto.svcId}"}) 
        SET r.rate = "${dto.rate}" 
        `)
      } 
      return updateRate;
    } catch (error) {
      throw new NotFoundException('')
    }
  }

  //6
  getServiceByMember(dto:AssociateSvcDto) {
    try {
    
      console.log('id=>', dto.userId)

        const findService = this.neo.read(`
        MATCH (u:User {userId:"${dto.userId}"})
        return u;
        `)

        return findService;
    } catch (error) {
      
    }
  }

  //7
  async findServiceList() {
    const r1 = await this.neo.read(`
    MATCH (s:Service) 
    RETURN s ;
    `);
    let array = [];

    for (let i = 0; i < r1.length; i++) {
      array.push(r1[i].s);
      console.log('Service List - ', array);
    }
    return array;
  }

  //8
  async findServiceById(id: string) {
    try {
      console.log('Service ID - ', id);

      const service = await this.neo.read(`
      MATCH (s:Service {svcId:"${id}"})
      RETURN s;
      `);

      console.log('Service', service);

      return service;
    } catch (error) {
      console.log('Service Not Found', error);
    }
  }
  
  //9
  remove(id: string) {
    try {
      console.log('Deleting the Service ID - ', id);
      const w1 = this.neo.write(`
      MATCH (s:Service {svcId:"${id}"}) 
      DETACH DELETE s
      `);
      console.log('Service Deleted Succesfully!');
      return 'Service Deleted Succesfully!';
    } catch (error) {}
  }


}
