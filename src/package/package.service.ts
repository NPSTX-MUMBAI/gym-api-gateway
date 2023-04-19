import { Neo4jService } from '@brakebein/nest-neo4j';
import {
  BadGatewayException,
  Get,
  HttpException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { ServiceDTO } from './dto/service.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import * as crypto from 'crypto';
import { log } from 'console';

@Injectable()
export class PackageService {
  constructor(private neo: Neo4jService) {}

  async create(dto: CreatePackageDto) {
    try {
      console.log(dto);
      const packageId = crypto.randomUUID();

      const query = `CREATE (p:Package { name:"${dto.name}",
      description:"${dto.description}",
      imgUrl:"${dto.imgUrl}",
      validFrom:"${dto.validFrom}",
      validTo:"${dto.validTo}",
      amount:"${dto.amount}",
      id:"${packageId}"}) return p`;

      const res = await this.neo.write(query);
      if (res && res.length > 0) {
        console.log('packageId=>', packageId);
        const q = `MATCH (g:Gym),(p:Package) WHERE 
        g.gymId="${dto.gymId}" AND p.id="${packageId}"  
        CREATE (g)-[r:HAS_PACKAGE {createdOn:"${Date.now()}"}]-> (p) RETURN r`;

        console.log(q);

        await this.neo.write(q);

        //handle case when package is created but failes to create relaationship..
        //role back the package creation?
        console.log(q);

        return { status: true, msg: 'Package Created successfully', data: q };
      }
    } catch (error) {
      console.log(error);

      throw new BadGatewayException(error);
    }
  }

  async createDefaultservice(dto: ServiceDTO) {
    try {
      console.log('inside package service');
      const defaultSvcs: ServiceDTO[] = [
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

  async findallpackage(Dto: CreatePackageDto) {
    try {
      const query = await this.neo.read(
        `match (g:Gym {gymId: "${Dto.gymId}"})-[r:HAS_PACKAGE]->(t:Package) return t as packages`,
      );
      // const all = query.push((e) => e.get('packages'));
      if (query.length > 0) {
        return { data: query, msg: 'Got ALl Packages', status: true };
      } else {
        return { msg: 'error', status: false };
      }
    } catch (error) {
      return 'erorr';
    }
  }

  async findpackagebyId(id: string) {
    console.log(id);
    try {
      const query = await this.neo.read(
        `match (t:Package {id: '${id}'}) return t as packages`,
      );
      // const all = query.push((e) => e.get('packages'));
      if (query.length > 0) {
        return { data: query, msg: 'Got Package By Id', status: true };
      } else {
        return { msg: 'error', status: false };
      }
    } catch (error) {
      return 'erorr';
    }
  }

  testPService() {
    try {
      const q = this.neo.read(`MATCH (p:Package),(s:Service) 
      WHERE p.id='1e67270f-8dcb-4a39-9c89-7730f5442050' AND s.id='38a2ca02-9e37-449a-9192-80ce4f2b1348' 
      CREATE (p) - [r:HAS_SERVICE] -> (s) RETURN type(r)`);
    } catch (error) {
      return new NotFoundException('Package Not Found!');
    }
  }

  async createService(dto: ServiceDTO) {
    try {
      const crypto = require('crypto');
      const id = crypto.randomUUID();

      const query = await this.neo.write(`
      CREATE (s:Service {name:"${dto.name}",
      imgUrl:"${dto.imgUrl}", 
      rate:"${dto.rate}"}) 
      return s
      union
      merge(g:gym {packageId: "${dto.packageId}"})-[r:HAS_SERVICE]->(s:service{serviceId:"${id}"}) return s`);

      console.log('GymID->', dto.packageId);
      console.log('MemberID->', dto.id);

      return { data: query, msg: 'ok' };
    } catch (error) {
      return new HttpException(error, 503);
    }
  }

  createCustomService() {}

  findAll() {
    return `This action returns all package`;
  }

  findOne(id: number) {
    return `This action returns a #${id} package`;
  }

  update(id: number, updatePackageDto: UpdatePackageDto) {
    return `This action updates a #${id} package`;
  }

  remove(id: number) {
    return `This action removes a #${id} package`;
  }
}
