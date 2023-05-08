import { Neo4jService } from '@brakebein/nest-neo4j';
import { HttpException, Injectable } from '@nestjs/common';

import * as crypto from 'crypto';

@Injectable()
export class ServicesService {
  constructor(private neo: Neo4jService) {}

  async createDefaultservice() {
    try {
      console.log('inside package service');
      const defaultSvcs: any[] = [
        {
          id: crypto.randomUUID(),
          isDefault: true,
          name: 'cardio',
          imgUrl: '../assets/cardio1.jpg',
        },
        {
          id: crypto.randomUUID(),
          isDefault: true,
          name: 'personal training',
          imgUrl: '../assets/Trainer1.jpg',
          rate:2000
        },
        {
          id: crypto.randomUUID(),
          isDefault: true,
          name: 'sauna',
          imgUrl: '../assets/sauna.jpg',
        },
      ];

      defaultSvcs.forEach(async (svc) => {
        const query = `CREATE (s:Service { id:"${svc.id}", 
      name:"${svc.name}", 
      imgUrl:"${svc.imgUrl}",
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

  findServiceList() {
    const r1 = this.neo.read(`
    MATCH (s:Service) 
    RETURN s
    `).then((res) => {
      
      console.log("r1",res);
    })

    

    // let array = []

    // for (let i = 0; i < array.length; i++) {
    //     array.push(r1[i].s)
    // }
    return {data: r1}
  }

}
