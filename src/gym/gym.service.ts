import { Neo4jService } from '@brakebein/nest-neo4j';

import {
  HttpException,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { stringify } from 'querystring';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { CreateBankDto } from 'src/bank/dto/create-bank.dto';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { Gym } from './entities/gym.entity';

@Injectable()
export class GymService {
  constructor(private neo: Neo4jService) {}

  // async create1(dto: CreateGymDto) {
  //   try {
  //     //step1: first check if the gym exists
  //     const gymExists = await this.neo.read(`MATCH (u:User {email:"${dto.createdBy}"})-[o:OWNS]->(g:Gym ) WHERE g.gymName="${dto.gymName}" AND g.email="${dto.email}"
  //     AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g `);

  //     console.log("gym=>", gymExists);
  //     if (gymExists.length > 0) {
  //       throw new ConflictException("gym exists with the same name for the same user");
  //     } else {
  //       let id: string;
  //       const res = await this.neo.write(`CREATE (g:Gym { gymId: apoc.create.uuid() ,gymName:"${dto.gymName}",
  //     email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})
  //     MERGE (a:Address {line1:"${dto.address.line1}",
  //       line2:"${dto.address.line2}", locality:"${dto.address.locality}",
  //       city:"${dto.address.city}",state:"${dto.address.state}",
  //       country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"})
  //       MERGE (g)-[r:LOCATED_IN]->(a) return a,g
  //    `)
  //       res.map((r) => {
  //         id = r.g.gymId;
  //         console.log("ID->",id);
  //       })
  //       if (res) {
  //         const r = await this.neo.write(`MATCH (u:User{id:"${dto.id}"}),(g:Gym {gymId:"${id}"})
  //         merge (u)-[o:OWNS]->(g) return o`);
  //         console.log("gym created successfully", r);
  //         return "gym created successfully"

  //       } else {
  //         return "failed to create gym due to invalid request"
  //       }
  //     }

  //   } catch (error) {
  //     console.log(error);
  //     throw new HttpException(error, 501);
  //   }

  // }



  // async create2(dto: CreateGymDto) {
  //   try {
  //     //step1: first check if the gym exists
  //     const gymExists = await this.neo
  //       .read(`MATCH (u:User {email:"${dto.createdBy}"})-[o:OWNS]->(g:Gym ) WHERE 
  //       g.gymName="${dto.name}" AND g.email="${dto.email}" 
  //     AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g `);

  //     console.log('gym=>', gymExists);
  //     if (gymExists.length > 0) {
  //       throw new ConflictException(
  //         'gym exists with the same name for the same user',
  //       );
  //     } else {
  //       let id: string;
  //       const res = await this.neo.write(`CREATE 
  //       (g:Gym { id: apoc.create.uuid() ,
  //         name:"${dto.name}",
          
  //     email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})

  //     MERGE (a:Address {line1:"${dto.address.line1}", 
  //       line2:"${dto.address.line2}", locality:"${dto.address.locality}", 
  //       city:"${dto.address.city}",state:"${dto.address.state}",
  //       country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"}) 

  //       MERGE (g)-[r:LOCATED_IN]->(a) return a,g
  //    `);
  //       res.map((r) => {
  //         id = r.g.gymId;
  //         console.log('ID->', id);
  //       });
  //       if (res) {
  //         const r = await this.neo
  //           .write(`MATCH (u:User{id:"${dto.id}"}),(g:Gym {gymId:"${id}"}) 
  //         merge (u)-[o:OWNS]->(g) return o`);
  //         console.log('gym created successfully', r);
  //         return 'gym created successfully';
  //       } else {
  //         return 'failed to create gym due to invalid request';
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new HttpException(error, 501);
  //   }
  // }


  async create(dto:CreateGymDto) {

    try {
      let gymId:string;
      let memberId:string;

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

        const linkMember = await this.neo.write(`
        MATCH (g:Gym {gymId:"${gymId}"}),(m:Member {memberId:"${dto.memberId}"}) 
        MERGE (g) - [r:HAS_MEMBER] -> (m)
        RETURN type(r)

        `)

        linkMember.map((res) => {
          memberId = res.m.memberId;
          console.log("Member ID - ",memberId);
          
        })

          
        return linkMember;

      }
    } catch (error) {
      console.log('',error);
      
    }
  }


  //Wrong Logic but Runnable
  // async create2(id: string, dto: CreateGymDto) {
  //   let gymId: string;

  //   try {
  //     //1 Check If Gym Exists
  //     const gymExist = await this.neo.read(`
  //     MATCH (g:Gym {
  //       id:"${id}",
  //       name:"${dto.name}",
  //       aadhar:"${dto.aadhar}",
  //       email:"${dto.email}",
  //       createdBy:"${dto.createdBy}",
  //       email:"${dto.email}",
  //       gstNo:"${dto.gstNo}",
  //       panNo:"${dto.panNo}"
  //     })
  //     RETURN g.id 
  //     `);

  //     if (gymExist.length < 0) {
  //       console.log('Gym is Alreary Exist with same Gym Details!');

  //       throw new ConflictException(
  //         'Gym exists with the same name for the same user',
  //       );
  //     } else {
  //       const createGym = await this.neo.write(`CREATE 
  //       (g:Gym { id: apoc.create.uuid() ,
  //         name:"${dto.name}",
          
  //     email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})

  //     MERGE (a:Address {line1:"${dto.address.line1}", 
  //       line2:"${dto.address.line2}", locality:"${dto.address.locality}", 
  //       city:"${dto.address.city}",state:"${dto.address.state}",
  //       country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"}) 
        
  //       MERGE (g)-[r:LOCATED_IN]->(a) return a,g
  //    `);

  //    createGym.map((res) => {
  //         gymId = res.g.id;
  //         console.log('Gym ID Is ', gymId);
  //       });

       
  //     }
  //   } catch (error) {}
  // }

  // async findAll() {
  //   try {
  //     const res = await this.neo.read(`MATCH (g:Gym) return g`);
  //     const gyms: Gym[] = [];
  //     res.map(r => {
  //       gyms.push(r.g)
  //     });
  //     return gyms;
  //   } catch (error) {
  //     throw new HttpException('error encountered', error);
  //   }
  // }

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
