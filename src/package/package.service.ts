import { Neo4jService } from '@brakebein/nest-neo4j';
import {
  BadGatewayException,
  BadRequestException,
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
  constructor(private neo: Neo4jService) { }

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


  async createService(dto: ServiceDTO) {
    try {
      const crypto = require('crypto');
      const id = crypto.randomUUID();

      const query = await this.neo.write(`
      CREATE (s:Service {name:"${dto.name}",
      imgUrl:"${dto.imgUrl}, id:"${id}, isDefault:"${dto.isDefault}"}
      return s
      union
      merge(p:Package {id: "${dto.packageId}"})-[r:HAS_SERVICE {createdOn:"${Date.now()}", rate:"${dto.rate}"}]->(s:Service{id:"${id}"}) return s`);
      if (query.length > 0) {
        return { data: query, msg: 'ok' };
      } else {
        throw new BadRequestException();
      }

    } catch (error) {
      return new HttpException(error, 503);
    }
  }

  createCustomService() { }

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

  // getServiceByPackageID() {
  //   try {
  //     //Trying for Platinum Package
  //     const r1 = this.neo
  //       .read(
  //         `
  //     MATCH (s:Service {id: "ef73a980-c02d-4d9a-a9e3-45e4b67ad1fb"})
  //     <-[r:HAS_SERVICE]-(p:Package {name: "Platinum Package"}) 
  //     return s,p
  //     `,
  //       )
  //       .then((res) => {
  //         console.log('Result-', res);
  //       });
  //     console.log('Reading...', r1);
  //   } catch (err) {
  //     console.log('Package Not Found By ServiceID!', err);
  //   }
  // }

  packageNames: string[];
  getPackageNames() {
    try {

      let pid = this.neo.read('MATCH (p:Package) return p.name,p.id')
        .then((res: any) => {
          console.log(res);
          if (res) {

            res.find((r) => {
              console.log("Package Names", r);
              this.packageNames = r;
              console.log("Package Names", this.packageNames);


            })



          }

        })


    } catch (err) {
      console.log('', err);
    }
  }
}
