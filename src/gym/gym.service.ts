import { Neo4jService } from '@brakebein/nest-neo4j';

import {
  HttpException,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { Neo4jTypeInterceptor } from 'nest-neo4j/dist';
import { stringify } from 'querystring';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { CreateBankDto } from 'src/bank/dto/create-bank.dto';
import { AssociateSvcDto } from 'src/services/dto/associateService.dto';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { Gym } from './entities/gym.entity';

@Injectable()
export class GymService {
  constructor(private neo: Neo4jService) {}


  // async create(dto:CreateGymDto) {

  //   try {
  //     let gymId:string;
  //     let userId:string;

  //     const createGym = await this.neo.write(`CREATE (g:Gym { gymId: apoc.create.uuid() ,name:"${dto.name}",
  //         email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})
  //         MERGE (a:Address {line1:"${dto.address.line1}",
  //           line2:"${dto.address.line2}", locality:"${dto.address.locality}",
  //           city:"${dto.address.city}",state:"${dto.address.state}",
  //           country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"})
  //           MERGE (g)-[r:LOCATED_IN]->(a) return a,g
  //        `)

  //     if(createGym.length > 0) {
  //         createGym.map((res) => {
  //           gymId = res.g.gymId
  //           console.log('Gym ID ',gymId);
            
  //       })

  //       const linkMember = await this.neo.write(`
  //       MATCH (g:Gym {gymId:"${gymId}"}),(u:User {userId:"${dto.userId}"}) 
  //       MERGE (g) - [r:HAS_MEMBER] -> (u)
  //       RETURN type(r)
  //       `)

  //       linkMember.map((res) => {
  //         userId = res.u.userId;
  //         console.log("User ID - ",userId);
          
  //       })

          

  //     }
  //   } catch (error) {
  //     console.log('',error);
      
  //   }
  // }


  async create(dto:CreateGymDto,svcDto:AssociateSvcDto) {

    try {
      let gymId:string;
      let userId:string;

      //1
      const createGym = await this.neo.write(`CREATE (g:Gym { gymId: apoc.create.uuid() ,name:"${dto.name}",
          email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})
          MERGE (a:Address {line1:"${dto.address.line1}",
            line2:"${dto.address.line2}", locality:"${dto.address.locality}",
            city:"${dto.address.city}",state:"${dto.address.state}",
            country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"})
            MERGE (g)-[r:LOCATED_IN]->(a) return a,g
         `)

      if(createGym.length > 0) {
          createGym.map((res) => {
            gymId = res.g.gymId
            console.log('Gym ID ',gymId);
            
        })

        //2
        const linkMember = await this.neo.write(`
        MATCH (g:Gym {gymId:"${gymId}"}),(u:User {userId:"${dto.userId}"}) 
        MERGE (g) - [r:HAS_MEMBER] -> (u)
        RETURN type(r)
        `)

        linkMember.map((res) => {
          userId = res.u.userId;
          console.log("User ID - ",userId);
          
        })


        //3
        // svcDto.services.map((service) => {
        //   const res = this.neo.write(`
        //     MATCH (g:Gym {gymId:"${gymId}"}),(s:Service {svcId:"${svcDto.svcId}"})
        //     MERGE (g) - [:HAS_SERVICE  {createdDate:"${Date.now()}",
        //     rate:"${service.rate}"     
        //   }] -> (s)
        //   return g
        //   `).then((res) => {
        //     console.log('Service added - ',res);
            
        //   })
        // })



      }
    } catch (error) {
      console.log('',error);
      
    }
  }



 

  async findAll() {
    try {
      const res = await this.neo.read(`MATCH (g:Gym) return g`);
      const gyms: Gym[] = [];
      res.map((r) => {
        gyms.push(r.g);
      });
      return gyms;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  async findAllGymForCurrentUser(userId: string) {
    try {
      console.log(userId);

      const res = await this.neo.read(
        `MATCH (u:User)-[:OWNS]->(g:Gym) where u.email=$email return g;`,
        { userId: userId },
      );
      const gyms: Gym[] = [];
      res.map((r) => gyms.push(r.g));

      return gyms;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  async getGymAddress(id: string) {
    try {
      const res2 = this.neo.read(`
      MATCH (g:Gym),(a:Address) WHERE g.id=$id and  
      `);

      const res = await this.neo.read(
        `MATCH (g:Gym {id:"${id}"}) where g.id=$id 
        return g;`,
        { id: id },
      );
      const gyms: Gym[] = [];
      res.map((r) => gyms.push(r.g));
      return gyms;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  // async getGymAddress(id: string) {
  //   try {
  //     const res = await this.neo.read(
  //       `MATCH (g:Gym) where g.id=$id return g;`,
  //       { id: id },
  //     );
  //     const gyms: Gym[] = [];
  //     res.map((r) => gyms.push(r.g));
  //     return gyms;
  //   } catch (error) {
  //     throw new HttpException('error encountered', error);
  //   }
  // }



  // async findOne(id: string) {
  //   try {
  //     const res = await this.neo.read(
  //       `MATCH (g:Gym) WHERE g.gymId=$id return g`,
  //       { id: id },
  //     );
  //     let gym: Gym;
  //     console.log(res);
  //     if (res && res.length > 0) {
  //       res.map((r) =>
  //       (gym = r.g));
  //       console.log("GymIDwise details - ",gym);

  //       return gym;
  //     } else {
  //       return null;
  //       //throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' });
  //     }

  //   } catch (error) {
  //     throw new HttpException('error encountered', error);
  //   }
  // }

  async findById(id: String) {
    const gymDetails = await this.neo.read(`
    MATCH (g:Gym{id:"${id}"}) RETURN g as gym;
    `);
    console.log('In Gym -', gymDetails);

    return gymDetails;
  }
  

  getGymdetailsByBankID(bankId: string) {
    let getDetails = this.neo.read(`
    MATCH (b:Bank {bankId:"${bankId}"}) - [a:HAS_ACCOUNT] - (g:Gym )
    RETURN g
    `);

    return getDetails;
  }


  attachSvc(dto:CreateGymDto) {
    console.log('Attaching Service start...');
      
        const w1 = this.neo.write(`
        MATCH (g:Gym {gymId:"${dto.gymId}"}),(s:Service {svcId:"${dto.svcId}"}) 
        CREATE (g) - [:HAS_SERVICE] -> (s)
        RETURN g;
        `)
  }

  detachSvc(dto:CreateGymDto) {
    try {

      console.log('Detaching Service start...');
      
      const selectService = this.neo.read(`
      MATCH (g:Gym {gymId:"${dto.gymId}"}) - [:HAS_SERVICE] - (s:Service {svcId:"${dto.svcId}"}) 
      RETURN g
      `).then((res) => {
        const w1 = this.neo.write(`
        MATCH (g:Gym {gymId:"${dto.gymId}"}) - [:HAS_SERVICE] - (s:Service {svcId:"${dto.svcId}"}) 
        DETACH DELETE s;

        `)
      })

    } catch (error) {
      console.log('Detach unsuccessful! Try Again',error);
      
    }
  }

  // async update(id: string, dto: UpdateGymDto) {
  //   try {
  //     const res = await this.neo.write(`MATCH (g:Gym) where g.id="${id}"
  //     SET
  //     g.name="${dto.name}",
  //     g.email="${dto.email}",
  //     g.panNo="${dto.panNo}",
  //     g.aadhar="${dto.aadhar}"
  //     return g
  //     `);
  //     return 'Gym updated successfully';
  //   } catch (error) {
  //     throw new HttpException('error updating gym', error);
  //   }
  // }

  async update(id: string, dto: UpdateGymDto) {
    try {
      const r1 = this.neo.read(`
      MATCH (g:Gym {id:"${id}"}) 
      RETURN g
      `);
      if (r1) {
        const res = await this.neo.write(`MATCH (g:Gym) where g.id="${id}" 
        SET
        g.name="${dto.name}",
        g.email="${dto.email}",
        g.panNo="${dto.panNo}",
        g.aadhar="${dto.aadhar}"
        return g
        `);
      }
      return 'Gym updated successfully';
    } catch (error) {
      throw new HttpException('error updating gym', error);
    }
  }

  async updateAddress(id: string, dto: UpdateGymDto) {
    try {
      const res = await this.neo
        .write(`MATCH (g:Gym {id:"${id}"})-[r:LOCATED_IN]->(a:Address)
      SET
      a.line1="${dto.address.line1}",
      a.line2="${dto.address.line2}",
      a.locality="${dto.address.locality}",
      a.city="${dto.address.city}",
      a.state="${dto.address.state}",
      a.country="${dto.address.country}",
      a.pinCode="${dto.address.pinCode}"
      return a
      `);
      console.log(res);
      return 'gym address updated successfully';
    } catch (error) {
      console.log(error);
      throw new HttpException('error updating gym', error);
    }
  }

  remove(id: string) {
    console.log('Deleting Gym ID Is', id);

    const w1 = this.neo.write(`
    MATCH (g:Gym {id:"${id}"}) 
    DETACH DELETE g
    `);
    console.log('Deleted Gym ID Is - ', id);
    return 'Deleted Gym Successfully! ';
  }

}
