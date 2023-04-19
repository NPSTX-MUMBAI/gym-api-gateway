import { Neo4jService } from '@brakebein/nest-neo4j';
import {
  ConflictException,
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
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';

@Injectable()
export class PackageService {
  constructor(private neo: Neo4jService) {}

  async create(dto: CreatePackageDto) {
    try {
      const cq = `CREATE (p:Package { name:"${dto.name}",
      createdOn:"${new Date().toLocaleDateString()}",
      createdTime:"${new Date().toLocaleTimeString()}",
      description:"${dto.description}",
      imgUrl:"${dto.imgUrl}",
      validFrom:"${dto.validFrom}",
      validTo:"${dto.validTo}",
      amount:"${dto.amount}",
      packageId:"${crypto.randomUUID()}"}) return p`;

      const res = await this.neo.write(cq);
      if (res && res.length > 0) {
        let packageId = '';
        res.map((row) => (packageId = row.p.id));
        console.log(packageId);

        const qr = `MATCH (g:Gym),(p:Package) WHERE 
        g.gymId='${dto.createdBy}' AND p.id='${packageId}  
        CREATE (g) - [r:HAS_PACKAGE] -> (p) RETURN type(r)`;

        await this.neo.write(qr);
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // async createDefaultservice(dto:ServiceDTO){
  //   try {
  //     console.log('inside package service')
  //     let defaultSvcs:ServiceDTO[]=[
  //       {
  //       id:crypto.randomUUID(),
  // createdOn:new Date().toLocaleDateString(),

  //       isDefault:true,
  //       name:'cardio',
  //       imgUrl:'../assets/cardio1.jpg'
  //     },
  //     {
  //       id:crypto.randomUUID(),
  // createdOn:new Date().toLocaleDateString(),
  //
  //       isDefault:true,
  //       name:'Personal Training',
  //       imgUrl:'../assets/Trainer1.jpg'
  //     },
  //     {
  //       id:crypto.randomUUID(),
  // createdOn:new Date().toLocaleDateString(),

  //       isDefault:true,
  //       name:'Sauna',
  //       imgUrl:'../assets/sauna.jpg'
  //     },
  //     {
  //       id:crypto.randomUUID(),
  // createdOn:new Date().toLocaleDateString(),
  //
  //       isDefault:true,
  //       name:'Lockers',
  //       imgUrl:'../assets/lockers.jpg'
  //     },
  //     {
  //       id:crypto.randomUUID(),
  // createdOn:new Date().toLocaleDateString(),

  //       isDefault:true,
  //       name:'Swimming',
  //       imgUrl:'../assets/swimpool1.jpg'
  //     },
  //     {
  //       id:crypto.randomUUID(),
  // createdOn:new Date().toLocaleDateString(),

  //       isDefault:true,
  //       name:'Strength Training',
  //       imgUrl:'../assets/Strengthtraining.jpg'
  //     },
  //     {
  //       id:crypto.randomUUID(),
  // createdOn:new Date().toLocaleDateString(),

  //       isDefault:true,
  //       name:'Yoga',
  //       imgUrl:'../assets/Yoga1.jpg'
  //     },
  //   ];

  //   defaultSvcs.forEach(async (svc)=>{
  //     const cq =`CREATE (s:Service { id:"${svc.id}",
  //     name:"${svc.name}",
  //     imgUrl:"${svc.imgUrl}",
  //     createdOn:"${svc.createdOn}"
  //     isDefault:"${svc.isDefault}"}) return s`
  //     console.log(cq);

  //     const res = await this.neo.write(cq);

  //     // res.map((row)=>packageId=row.p.id)

  //     let serviceId = '';

  //     if(res) {
  //       res.map((row) => serviceId = row.s.id);
  //       console.log("IDMapping-",res);
  //       console.log("SID-",serviceId);

  //       const mcq = `MATCH(p:Package),(s:Service) WHERE p.name='Diwali Package'
  //       AND s.name='sauna' CREATE (p) - [r:HAS_SERVICE] -> (u)
  //       RETURN type(r)`

  //       await this.neo.write(mcq);

  //     }

  //   })

  //   console.log('outside loop')
  //   return true;

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async createDefaultservice(dto: ServiceDTO) {
    try {
      console.log('inside package service');
      const defaultSvcs: ServiceDTO[] = [
        {
          svcId: crypto.randomUUID(),
          createdOn: new Date().toLocaleDateString(),
          isDefault: true,  
          name: 'Lockers',
          imgUrl: '../assets/lockers.jpg',
        },
        {
          svcId: crypto.randomUUID(),
          createdOn: new Date().toLocaleDateString(),
          isDefault: true,
          name: 'Yoga',
          imgUrl: '../assets/Yoga1.jpg',
        },
        {
          svcId: crypto.randomUUID(),
          createdOn: new Date().toLocaleDateString(),
          isDefault: true,  
          name: 'Cardio',
          imgUrl: '../assets/lockers.jpg',
        },
        {
          svcId: crypto.randomUUID(),
          createdOn: new Date().toLocaleDateString(),
          isDefault: true,  
          name: 'Personal Training',
          imgUrl: '../assets/lockers.jpg',
        },
        {
          svcId: crypto.randomUUID(),
          createdOn: new Date().toLocaleDateString(),
          isDefault: true,  
          name: 'Strength Training',
          imgUrl: '../assets/lockers.jpg',
        },
        {
          svcId: crypto.randomUUID(),
          createdOn: new Date().toLocaleDateString(),
          isDefault: true,  
          name: 'Swimming',
          imgUrl: '../assets/lockers.jpg',
        },
        {
          svcId: crypto.randomUUID(),
          createdOn: new Date().toLocaleDateString(),
          isDefault: true,  
          name: 'Sauna',
          imgUrl: '../assets/lockers.jpg',
        },

      ];

      defaultSvcs.forEach(async (svc) => {
        const query = `CREATE (s:Service { svcId:"${svc.svcId}", 
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

  // async findallpackage(Dto: CreatePackageDto) {
  //   try {
  //     const query = await this.neo.read(
  //       `match (g:Gym {gymId: "${Dto.gymId}"})-[r:HAS_PACKAGE]->(t:Package) return t as packages`,
  //     );

  //     // const all = query.push((e) => e.get('packages'));
  //     if (query.length > 0) {
  //       return { data: query, msg: 'Got ALl Packages', status: true };
  //     } else {
  //       return { msg: 'error', status: false };
  //     }
  //   } catch (error) {
  //     return 'erorr';
  //   }
  // }

  //Running
  async findpackagebyId(id: string) {
    console.log(id);
    try {
      const query = await this.neo.read(
        `match (t:Package {id: '${id}'}) return t as packages`,
      );
      // const all = query.push((e) => e.get( 'packages'));
      if (query.length > 0) {
        return { data: query, msg: 'Got Package By Id', status: true };
      } else {
        return { msg: 'error', status: false };
      }
    } catch (error) {
      return 'erorr';
    }
  }

  


  packagelist: CreatePackageDto[] = [];

  //Running
  async findAll() {
    try {
      const packages = await this.neo.read(`MATCH (p:Package) RETURN p`);

      packages.map((r) => {
        this.packagelist.push(r.p);
      });
      return this.packagelist;
    } catch (error) {
      throw new HttpException('', error);
    }
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

  packageNames :string[];
  getPackageNames() {
    try {

     let pid =  this.neo.read('MATCH (p:Package) return p.name,p.id')
     .then((res:any) => {
       console.log(res);
       if(res) {
         
         res.find((r)=>{
           console.log("Package Names",r);
           this.packageNames = r;
           console.log("Package Names",this.packageNames);
           

        })
          

        
       }

     })
      

    } catch (err) {
      console.log('', err);
    }
  }
}
