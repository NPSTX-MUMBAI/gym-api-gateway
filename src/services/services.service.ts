import { Neo4jService } from '@brakebein/nest-neo4j';
import { HttpException, Injectable } from '@nestjs/common';

import * as crypto from 'crypto';
import { ServiceDTO } from 'src/package/dto/service.dto';

@Injectable()
export class ServicesService {
   
  constructor(private neo: Neo4jService) { }

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
          rate:1000
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Yoga',
          imgUrl: '../assets/Yoga1.jpg',
          rate:1000
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,  
          name: 'Cardio',
          imgUrl: '../assets/cardio1.jpg',
          rate:1000
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,  
          name: 'Personal Training',
          imgUrl: '../assets/Trainer1.jpg',
          rate:2000
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,  
          name: 'Strength Training',
          imgUrl: '../assets/Strengthtraining.jpg',
          rate:2500
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,  
          name: 'Swimming',
          imgUrl: '../assets/swimpool1.jpg',
          rate:2000
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,  
          name: 'Sauna',
          imgUrl: '../assets/sauna.jpg',
          rate:3000
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
    const r1 =await this.neo.read(`
    MATCH (s:Service) 
    RETURN s ;
    `)
  let array =[]
 
  for (let i = 0; i < r1.length; i++) {
    array.push(r1[i].s)
    console.log(); 
    
  }
    return array;
  }


  remove(id:string) {

    console.log('Deleting the Service ID - ',id);
    
    const w1 = this.neo.write
    (`
    MATCH (s:Service {svcId:"${id}"}) 
    DETACH DELETE b
    `);
    
    console.log('Service Deleted Succesfully!');
    
  }
  
}
