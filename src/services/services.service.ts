import { Neo4jService } from '@brakebein/nest-neo4j';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import * as crypto from 'crypto';
import { NotFoundError } from 'rxjs';
import { ServiceDTO, serviceType } from 'src/package/dto/service.dto';

@Injectable()
export class ServicesService {
  
  constructor(private neo: Neo4jService) {}

  //old
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
          serviceType:[serviceType.RECURRING]
          
        },  
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Yoga',
          imgUrl: '../assets/Yoga1.jpg',
          rate: 1000,
          serviceType:[serviceType.RECURRING]
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Cardio',
          imgUrl: '../assets/cardio1.jpg',
          rate: 1000,
          serviceType:[serviceType.RECURRING]
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Personal Training',
          imgUrl: '../assets/Trainer1.jpg',
          rate: 2000,
          serviceType:[serviceType.RECURRING]
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Strength Training',
          imgUrl: '../assets/Strengthtraining.jpg',
          rate: 2500,
          serviceType:[serviceType.INSTANCE]
          
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Swimming',
          imgUrl: '../assets/swimpool1.jpg',
          rate: 2000,
          serviceType:[serviceType.RECURRING]
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Sauna',
          imgUrl: '../assets/sauna.jpg',
          rate: 3000,
          serviceType:[serviceType.RECURRING]
        },
      ];

      defaultSvcs.forEach(async (svc) => {
        const query = `CREATE (s:Service { svcId:"${svc.svcId}", 
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
      console.log();
    }
    return array;
  }

  async findServiceById(id:string) {
    console.log("Service ID - ",id);
    
    try {
    const r1 = await this.neo.read(
      `MATCH (s:Service {svcId:"${id}"}) 
    RETURN s`)
    

  } catch (err) {
    return err.response;
  }
  }

  update(id:string,svcDto:ServiceDTO) {

    try {
    const r1 = this.neo.read(`
    MATCH (s:Service {svcId:"${id}"})
    SET 
    a1 : "${svcDto.name}",
    a2 : "${svcDto.rate}",
    a3: "${svcDto.isDefault}"
    RETURN s
    `)
    return r1;

  } catch (error) {
      throw new HttpException({},404)
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

  remove(id: string) {
    try {
      console.log('Deleting the Service ID - ', id);

      const w1 = this.neo.write(`
      MATCH (s:Service) 
      WHERE s.svcId = "${id}" 
      DETACH DELETE s
      `);

      console.log('Service Deleted Succesfully!');
      return 'Service Deleted Succesfully!';
    } catch (error) {}
  }

  // async createCustomService(dto:ServiceDTO) {
  //   const res=await this.neo.read(`MATCH (g:Gym {id:"${dto.id}"})-[:HAS_SERVICE]->(s:Service) where s.name="${dto.name}" return s`);
   
  //   if(res.length>0){
  //     return {status:false, msg:'service already exists with this gym'}
  //   }else{
  //     const svcId=crypto.randomUUID();

  //     const r=await this.neo.write(`CREATE (s:Service {id:"${svcId}",name:"${dto.name}",
  //     rate:"${dto.rate}",serviceType:"${dto.serviceType}",noOfOccurence:"${dto.noOfOccurence}"}) 
  //     MERGE (g:Gym {id:"${dto.id}"})-[r:HAS_SERVICE {createdOn:"${Date.now()}"}]->(s)
  //     return s`);

  //     return r.length>0?{status:true}:{status:false, msg:'failed to create service association with gym'}
  //   }
 
  // }


  async createCustomService(dto:ServiceDTO) {

    try {
      const res= await this.neo.read(`match (g:Gym {id:"${dto.gymId}"})-[r:HAS_SERVICE]->(s:Service {name:"${dto.name}"}) RETURN g`) 
        console.log(res);     
      if (res.length == 0) {
          const svcId=crypto.randomUUID()
           const r1=  await this.neo.write(`merge (s:Service {svcId: "${svcId}",name:"${dto.name}",serviceType:"${dto.serviceType}"})
           return s`) 
             const r2 = await this.neo.write(` match (g:Gym {id :"${dto.gymId}"}),(s: Service {svcId:"${svcId}"})
             merge (g)-[r:HAS_SERVICE {createdOn:"${Date.now()}", rate: "${dto.rate}"}]->(s) return s`)
              return { data:r1, msg: "created", status: true}
        } else {
           return {data: null, msg: "already exits", status: false}
        }
    } catch (error) {
      error
    }
    
     
  }
}