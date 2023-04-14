import { Neo4jService } from '@brakebein/nest-neo4j';
import { Get, HttpException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { ServiceDTO } from './dto/service.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import * as crypto from 'crypto';

@Injectable()
export class PackageService {

  constructor(private neo:Neo4jService){}
  
  async create(dto: CreatePackageDto) {
    try {
      const cq =`CREATE (p:Package { name:"${dto.name}",
      createdOn:"${Date.now().toString()}",
      description:"${dto.description}",
      imgUrl:"${dto.imgUrl}",
      validFrom:"${dto.validFrom}",
      validTo:"${dto.validTo}",
      amount:"${dto.amount}",
      id:"${crypto.randomUUID()}"}) return p`

    const res= await this.neo.write(cq);
      if(res && res.length>0){
        let packageId="";
        res.map((row)=>packageId=row.p.id)
        console.log(packageId);

        const qr =`MATCH (g:Gym),(p:Package) WHERE 
        g.gymId='${dto.createdBy}' AND p.id='${packageId}  
        CREATE (g) - [r:HAS_PACKAGE] -> (p) RETURN type(r)`

        await this.neo.write(qr) 
      return true; 
      }
    } catch (error) {
      console.log(error)
    }
  }

  async createDefaultservice(dto:ServiceDTO){
    try {
      console.log('inside package service')
      let defaultSvcs:ServiceDTO[]=[
        {
        id:crypto.randomUUID(),
        isDefault:true,
        name:'cardio',
        imgUrl:'../assets/cardio1.jpg'
      },
      {
        id:crypto.randomUUID(),
        isDefault:true,
        name:'Personal Training',
        imgUrl:'../assets/Trainer1.jpg'
      },
      {
        id:crypto.randomUUID(),
        isDefault:true,
        name:'Sauna',
        imgUrl:'../assets/sauna.jpg'
      },
      {
        id:crypto.randomUUID(),
        isDefault:true,
        name:'Lockers',
        imgUrl:'../assets/lockers.jpg'
      },
      {
        id:crypto.randomUUID(),
        isDefault:true,
        name:'Swimming',
        imgUrl:'../assets/swimpool1.jpg'
      },
      {
        id:crypto.randomUUID(),
        isDefault:true,
        name:'Strength Training',
        imgUrl:'../assets/Strengthtraining.jpg'
      },
      {
        id:crypto.randomUUID(),
        isDefault:true,
        name:'Yoga',
        imgUrl:'../assets/Yoga1.jpg'
      },
    ];
          
    defaultSvcs.forEach(async (svc)=>{
      const cq =`CREATE (s:Service { id:"${svc.id}", 
      name:"${svc.name}", 
      imgUrl:"${svc.imgUrl}",
      isDefault:"${svc.isDefault}"}) return s`
      console.log(cq);
     
      const res = await this.neo.write(cq);

      // res.map((row)=>packageId=row.p.id)

      let serviceId = '';

      if(res) {
        res.map((row) => serviceId = row.s.id);
        console.log("IDMapping-",res);
        console.log("SID-",serviceId);
        
        const mcq = `MATCH(p:Package),(s:Service) WHERE p.name='Diwali Package' 
        AND s.name='sauna' CREATE (p) - [r:HAS_SERVICE] -> (u) 
        RETURN type(r)`
        
        await this.neo.write(mcq);

      }

    })

    console.log('outside loop')
    return true;

    } catch (error) {
      console.log(error);
      throw new HttpException(error,402)
    }
  }

  createCustomService(){

  }

  findAll() {
    
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
