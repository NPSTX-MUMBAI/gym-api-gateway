import { Neo4jService } from '@brakebein/nest-neo4j';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { log } from 'console';

import * as crypto from 'crypto';
import { NotFoundError } from 'rxjs';
import { ServiceDTO, serviceType } from 'src/package/dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private neo: Neo4jService) {}

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

          rate: 1000,
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Yoga',
          imgUrl: '../assets/Yoga1.jpg',
          serviceType: [serviceType.INSTANCE],
          noOfOccurrence: 1,
          rate: 1000,
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Cardio',
          imgUrl: '../assets/cardio1.jpg',
          serviceType: [serviceType.RECURRING],

          rate: 1000,
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Personal Training',
          imgUrl: '../assets/Trainer1.jpg',
          serviceType: [serviceType.RECURRING],

          rate: 2000,
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Strength Training',
          imgUrl: '../assets/Strengthtraining.jpg',
          serviceType: [serviceType.INSTANCE],
          noOfOccurrence: 4,
          rate: 2500,
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Swimming',
          imgUrl: '../assets/swimpool1.jpg',
          serviceType: [serviceType.INSTANCE],
          noOfOccurrence: 6,
          rate: 2000,
        },
        {
          svcId: crypto.randomUUID(),
          isDefault: true,
          name: 'Sauna',
          imgUrl: '../assets/sauna.jpg',
          serviceType: [serviceType.RECURRING],

          rate: 3000,
        },
      ];

      defaultSvcs.forEach(async (svc) => {
        const query = `CREATE (s:Service { svcId:"${svc.svcId}", 
      name:"${svc.name}", 
      imgUrl:"${svc.imgUrl}",
      rate:"${svc.rate}",
      createdOn:"${svc.createdOn}",
      serviceType:"${svc.serviceType}",
      noOfOccurrence:"${svc.noOfOccurrence}",
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
    const array = [];

    for (let i = 0; i < r1.length; i++) {
      array.push(r1[i].s);
      console.log();
    }
    return array;
  }

  // async findServiceById(id: string) {
  //   console.log('Service ID - ', id);

  //   try {
  //     const r1 = await this.neo.read(
  //       `MATCH (s:Service {svcId:"${id}"})
  //   RETURN s`,
  //     );
  //   } catch (err) {
  //     return err.response;
  //   }
  // }

  update(id: string, svcDto: ServiceDTO) {
    try {
      const r1 = this.neo.read(`
    MATCH (s:Service {svcId:"${id}"})
    SET
    a1 : "${svcDto.name}",
    a2 : "${svcDto.rate}",
    a3: "${svcDto.isDefault}"
    RETURN s
    `);
      return r1;
    } catch (error) {
      throw new HttpException({}, 404);
    }
  }

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

  async createCustomService(dto: ServiceDTO) {
    try {
      const res = await this.neo.read(
        `match (g:Gym {id:"${dto.gymId}"})-[r:HAS_SERVICE]->(s:Service {name:"${dto.name}"}) RETURN g`,
      );
      console.log(res);
      if (res.length == 0) {
        const svcId = crypto.randomUUID();
        const r1 = await this.neo
          .write(`merge (s:Service {svcId: "${svcId}",name:"${dto.name}",serviceType:"${dto.serviceType}"})
           return s`);
        const r2 = await this.neo.write(` match (g:Gym {id :"${
          dto.gymId
        }"}),(s: Service {svcId:"${svcId}"})
             merge (g)-[r:HAS_SERVICE {createdOn:"${Date.now()}", rate: "${
          dto.rate
        }"}]->(s) return s`);
        return { data: r1, msg: 'created', status: true };
      } else {
        return { data: null, msg: 'already exits', status: false };
      }
    } catch (error) {
      error;
    }
  }

  async selectedServices(dto: any) {
    try {
      const arr: any[] = dto.array;
      let query;
      let i;
      for (i = 0; i < arr.length; i++) {
        query = await this.neo.write(
          `CREATE -[r:HAS_Selected]->(g:Gym {id:"${dto.id}"})(s:Service {svcId:"${arr[i]}"}) RETURN r`,
        );
      }

      if (arr.length == i) {
        return { data: query, msg: 'Services', status: true };
      } else {
        return { data: null, msg: 'Error Service Not Found', status: false };
      }
    } catch (error) {
      return error;
    }
  }

  async findServiceByGymId(id: string) {
    try {
      const query = await this.neo.read(
        `match (g:Gym {id:"${id}"})-[r:HAS_SERVICE]->(s:Service) RETURN s`,
      );
      console.log(query);

      if (query.length > 0) {
        return { data: query, msg: 'Services Found', status: true };
      } else {
        return { data: null, msg: 'Error Service Not Found', status: false };
      }
    } catch (error) {
      return error;
    }
  }

  async deleteServiceByGymId(
    dto: ServiceDTO,
  ): Promise<{ status: boolean; msg: string; data?: any }> {
    try {
      console.log(dto);
      const query = await this.neo.write(
        `match (g:Gym {id:"${dto.id}"})-[r:HAS_SERVICE]->(s:Service {svcId:"${dto.svcId}"}) delete r`,
      );
      console.log(query);

      if (query) {
        return { data: query, msg: 'Services Remove', status: true };
      } else {
        return { data: null, msg: 'Error', status: false };
      }
    } catch (error) {
      return { status: false, msg: 'failed' };
    }
  }
}
