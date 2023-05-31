import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '@brakebein/nest-neo4j';

import * as crypto from 'crypto';
import { identity, NotFoundError } from 'rxjs';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';
import { ServiceDTO } from 'src/services/dto/service.dto';
import { AssociateSvcDto } from './dto/associateService.dto';

@Injectable()
export class ServicesService {
  constructor(private neo: Neo4jService) {}

  // old
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

  async createDefaultservice(dto: ServiceDTO) {
    try {
      console.log('inside package service');
      const defaultSvcs: ServiceDTO[] = [
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Lockers',
          imgUrl: '../assets/lockers.jpg',
          rate: 1000,
          svcType:"recurring",
          isActive:'True',
          createdOn:`${new Date()}`
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Yoga',
          imgUrl: '../assets/Yoga1.jpg',
          rate: 1000,
          svcType:"recurring",
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Cardio',
          imgUrl: '../assets/cardio1.jpg',
          rate: 1000,
          svcType:"recurring",
          isActive:'True',
          createdOn:`${new Date()}`

        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Personal Training',
          imgUrl: '../assets/Trainer1.jpg',
          rate: 2000,
          svcType:"recurring",
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Strength Training',
          imgUrl: '../assets/Strengthtraining.jpg',
          rate: 2500,
          svcType:"recurring",
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Swimming',
          imgUrl: '../assets/swimpool1.jpg',
          rate: 2000,
          svcType:"recurring",
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Sauna',
          imgUrl: '../assets/sauna.jpg',
          rate: 3000,
          svcType:"recurring",
          isActive:'True',
          createdOn:`${new Date()}`


        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'HIT Service',
          imgUrl: '../assets/sauna.jpg',
          rate: 3000,
          svcType:"instance",
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
        rate:"${svc.rate}",
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

  updateRate(dto: ServiceDTO) {
    try {
      const w1 = this.neo.write(`
    MATCH (s:Service {svcId:"${dto.svcId}"})
    SET 
    s.rate = "${dto.rate}"
    RETURN s
    `);
      return w1;
    } catch (error) {
      throw new HttpException({}, 404);
    }
  }

  

  findActiveServices() {}

  // async addService(id, svcDto:ServiceDTO, gymDto:CreateGymDto) {
  //   try {
  //     let svcId : string

  //    const createSvc = await this.neo.write(`
  //     CREATE (s:Service {
  //       svcId:apoc.create.uuid(),
  //       name : "${svcDto.name}",
  //       rate: "${svcDto.rate}",
  //        isDefault: "${svcDto.isDefault}",
  //        svcType: "${svcDto.svcType}",
  //        createdOn: "${new Date()}"
  //       })
  //       return s
  //       `)
  //       createSvc.map((res) => {
  //         svcId = res.s.svcId;

  //         console.log("Service ID ",svcId);

  //   })
  //       if(createSvc) {
  //         const w1 = this.neo.write(`
  //         MATCH (g:Gym {id:"${gymDto.id}"}), (s:Service {svcId:${svcId}})
  //         CREATE (g) - [r:HAS_SERVICE] -> (s)
  //         RETURN s
  //         `)
  //       }

  //       return createSvc;

  //     }
  //     catch(error) {
  //       console.log('',error);

  //     }

  //   }

  async addCustomService(svcDto: ServiceDTO) {
    let svcId: string;

    const createSvc = await this.neo.write(`
      CREATE (s:Service {
        svcId:apoc.create.uuid(),
        name : "${svcDto.name}",
        rate: "${svcDto.rate}",
         isDefault: "${svcDto.isDefault}",
         svcType: "${svcDto.svcType}",
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

    // if (createSvc) {
    //   const linkWithGym = this.neo.write(`
    //   MATCH (g:Gym {id:"${id}"}),(s:Service {svcId:"${svcId}"})
    //   MERGE (g) - [:HAS_SERVICE] -> (s)
    //   RETURN g
    //   `);
    //   console.log('Service is added with Gym ID ', id);

    //   return linkWithGym;
    // } else {
    //   console.log('Something went Wrong! Service Error ');
    // }
  }

        

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



  async associateSvc(dto:AssociateSvcDto) {
      try {

        

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
        
      } catch (error) {
        console.log(error);
        return {status:false, data:error, msg:'failed due to technical error'}
        
      }
    }

    deassociateSvcWithMember(dto:AssociateSvcDto) {
      console.log('Deassociation starts...');
      
      try {
        //1
        const selectService = this.neo.read(`
        MATCH (u:User {userId:"${dto.memberId}"})
        RETURN u
        `)

        //2
        const r2 = this.neo.write(`
        MATCH (u:User {userId:"${dto.memberId}"}) - [r:SUBSCRIBED_TO] - (s:Service {svcId:"${dto.services[0].svcId}"})
        DETACH DELETE r
        
        `)
        return r2

      } catch (error) {
        console.log('',error);
        
      }
    }

    //Working in progress
    // updateSubscriptionRate(dto:ServiceDTO) {
    //   try {
    //     const check = this.neo.read(`
    //     MATCH (u:User {userId:"${dto.userId}") - [:SUBSCRIBED_TO] - (s:Service {svcId:"${dto.svcId}"})
    //     RETURN u
    //     `)

    //     if(check) {
    //       console.log('Member Has Acquired This Service!');
    //       return 'Member Has Acquired This Service!'
          
    //     } else {
    //       return '----------------'
    //     }
 
    //   } catch (error) {
        
    //   }  
    // }

  // getServiceByGymId(id: string) {
  //   const service = this.neo.read(`
  //     MATCH (s:Service {svcId:"${id}"})
  //     RETURN s
  //     `);

  //   return service;
  // }

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



  // remove(id:string) {

  //   try {

  //   console.log('Deleting the Service ID - ',id);

  //   const w1 = this.neo.write
  //   (`
  //   MATCH (s:Service {svcId:"${id}"})
  //   DETACH DELETE s
  //   `);

  //   console.log('Service Deleted Succesfully!');
  //   return "Service Deleted Succesfully!"

  // } catch (error) {

  // }
  // }
  //}

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
