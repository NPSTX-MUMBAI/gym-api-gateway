import { Neo4jService } from '@brakebein/nest-neo4j';

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { log } from 'console';

import * as crypto from 'crypto';

import { NotFoundError } from 'rxjs';
import { AssociateSvcDto } from 'src/package/dto/associateService.dto';

import {
  ServiceDTO,
  ServicesDTO,
  serviceType,
} from 'src/package/dto/service.dto';
import { updateService } from 'src/package/dto/updateservice.dto';

@Injectable()
export class ServicesService {
  constructor(private neo: Neo4jService) {}

  async createDefaultservice() {
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
        console.log(defaultSvcs);
        const res = await this.neo.write(query);

        console.log(res);
      });

      console.log('outside loop');

      return defaultSvcs;
    } catch (error) {
      console.log(error);

      throw new HttpException(error, 402);
    }
  }

  async fetchServiceList() {
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

  async associateServiceWithGym(gymId: string, svcId: string, rate: number) {
    try {
      //step1: check if service is already associated or not.if already associated, then no action required

      const chk = await this.neo.read(
        `match (g:Gym {id:"${gymId}"})-[r:HAS_SERVICE]->(s:Service{svcId:"${svcId}"}) return g`,
      );

      console.log(chk);

      if (chk.length > 0) {
        return {
          status: false,

          msg: `gym with id ${gymId} is already associated with service ${svcId}`,
        };
      } else {
        const currentDate = Date.now();

        const res = await this.neo
          .write(`match (g:Gym {id:"${gymId}"}), (s:Service{svcId:"${svcId}"})
      
       CREATE (g)-[r:HAS_SERVICE {rate:"${rate}", createdOn:"${currentDate}"}]->(s) return r`);

        console.log(res);

        return {
          status: true,

          msg: 'service associated successfully',

          data: res,
        };
      }
    } catch (error) {
      console.log(error);

      return {
        status: false,

        data: error,

        msg: 'technical error encountered. please contact system admin',
      };
    }
  }

  async createCustomService(dto: ServiceDTO) {
    try {
      const res = await this.neo.read(
        `match (g:Gym {id:"${dto.id}"})-[r:HAS_SERVICE]->(s:Service {name:"${dto.name}",rate:"${dto.rate}"}) RETURN g`,
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
        }"}]->(s) return s, r.rate`);

        console.log('yyftddgg', r2);

        return { data: r2, msg: 'created', status: true };
      } else {
        return { data: null, msg: 'already exits', status: false };
      }
    } catch (error) {
      error;
    }
  }

  async selectedServices(dto: ServiceDTO) {
    try {
      const arr: Array<ServicesDTO> = dto.svcIds;

      let query;

      let i;

      for (i = 0; i < arr.length; i++) {
        query = await this.neo.write(
          `MERGE (g:Gym {id:"${dto.id}"})-[r:HAS_SERVICE]->(s:Service {svcId:"${arr[i].svcId}",name:"${arr[i].name}"}) RETURN r`,
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

  async getServiceByGymId(id: string) {
    try {
      console.log('id=>', id);

      const query = await this.neo.read(
        `MATCH (g:Gym {id:"${id}"})-[r:HAS_SERVICE]->(s:Service)  RETURN s, r.rate`,
      );

      console.log(query);

      if (query.length > 0) {
        const array = [];

        for (let i = 0; i < query.length; i++) {
          array.push({ ...query[i].s, rate: query[i]['r.rate'] });

          console.log('SERVICES', array);
        }

        return { data: array, msg: 'Services Found', status: true };
      } else {
        return { data: null, msg: 'Error Service Not Found', status: false };
      }
    } catch (error) {
      console.log(error);

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
  async updateService(id: string, dto: updateService) {
    try {
      console.log('SERVICESSSSS', id);

      const res = await this.neo
        .write(`MATCH (g:Gym {id:"${dto.id}"})-[r:HAS_SERVICE]->(s:Service{svcId:"${id}"})
    
    SET s.name="${dto.name}"
    
    SET r.rate="${dto.rate}"
    
    return g,s
    
     `);

      console.log(res);

      return 'Service updated successfully';
    } catch (error) {
      throw new HttpException('error updating Services', error);
    }
  }
  async associateSvc(dto: AssociateSvcDto) {
    try {
      dto.services.map(async (service) => {
        const res = await this.neo
          .write(
            `MATCH (u:User {userId:"${dto.userId}"}),

        (s:Service {svcId:"${service.svcId}"})

        MERGE (u)-[r:SUBSCRIBED_TO {subscriptionDate:"${Date.now()}",

        rate:"${service.rate}"}]->(s) return r

       `,
          )
          .then((res) => {
            console.log('=====', res);
          });
      });

      return {
        status: true,
        data: null,
        msg: 'all association done successfully',
      };
    } catch (error) {
      console.log(error);

      return {
        status: false,
        data: error,
        msg: 'failed due to technical error',
      };
    }
  }
}
