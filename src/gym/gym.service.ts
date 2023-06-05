import { Neo4jService } from '@brakebein/nest-neo4j';

// 2a20cbfe-deb9-4a77-8bd4-05f7417558be

import {
  HttpException,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { CreateBankDto } from 'src/bank/dto/create-bank.dto';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { Gym } from './entities/gym.entity';
import { log } from 'console';

@Injectable()
export class GymService {
  constructor(private neo: Neo4jService) {}
  // async create(dto: CreateGymDto) {
  //   try {
  //     //step1: first check if the gym exists
  //     const gymExists = await this.neo.read(`MATCH (u:User {email:"${dto.createdBy}"})-[o:OWNS]->(g:Gym ) WHERE g.name="${dto.name}" AND g.email="${dto.email}"
  //     AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g `);

  //     console.log("gym=>", gymExists);
  //     if (gymExists.length > 0) {
  //       throw new ConflictException("gym exists with the same name for the same user");
  //     } else {
  //       let id: string;
  //       const res = await this.neo.write(`CREATE (g:Gym { gymId: apoc.create.uuid() ,name:"${dto.name}",
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

  // async create(dto: CreateGymDto) {
  //   try {
  //     //step1: first check if the gym exists
  //     const gymExists = await this.neo
  //       .read(`MATCH (u:User {userId:"${dto.userId}"})-[o:OWNS]->(g:Gym ) WHERE g.name="${dto.name}" AND g.email="${dto.email}"
  //     AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g `);

  //     console.log('gym=>', gymExists);
  //     if (gymExists.length > 0) {
  //       throw new ConflictException(
  //         'gym exists with the same name for the same user',
  //       );
  //     } else {
  //       let id: string;
  //       const res = await this.neo
  //         .write(`CREATE (g:Gym { id: apoc.create.uuid() ,name:"${dto.name}",
  //     email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}",userId:"${dto.userId}"})
  //     MERGE (a:Address {line1:"${dto.address.line1}",
  //       line2:"${dto.address.line2}", locality:"${dto.address.locality}",
  //       city:"${dto.address.city}",state:"${dto.address.state}",
  //       country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"})
  //       MERGE (g)-[r:LOCATED_IN]->(a) return a,g
  //    `);
  //       console.log(res, 'my gymm');

  //       res.map((r) => (id = r.g.id));
  //       console.log('ID->', id);
  //       if (res) {
  //         const r = await this.neo.write(`MATCH (u:User{userId:"${
  //           dto.userId
  //         }"}),(g:Gym {id:"${id}"})
  //         merge (u)-[o:OWNS {createdOn:"${Date.now()}"}]->(g) return o`);
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

  async create(dto: CreateGymDto) {
    try {
      //step1: first check if the gym exists

      const gymExists = await this.neo
        .read(`MATCH (u:User {userId:"${dto.userId}"})-[o:OWNS]->(g:Gym ) WHERE g.name="${dto.name}" AND g.email="${dto.email}"
    
    AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g `);

      console.log('gym=>', gymExists);

      if (gymExists.length > 0) {
        throw new ConflictException(
          'gym exists with the same name for the same user',
        );
      } else {
        let gymId: string;

        const res = await this.neo
          .write(`CREATE (g:Gym { gymId: apoc.create.uuid() ,name:"${dto.name}",
    
  email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}",userId:"${dto.userId}"})
    
  MERGE (a:Address {line1:"${dto.address.line1}",
    
  line2:"${dto.address.line2}", locality:"${dto.address.locality}",
    
  city:"${dto.address.city}",state:"${dto.address.state}",
    
  country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"})
    
  MERGE (g)-[r:LOCATED_IN]->(a) return a,g
    
  `);

        console.log(res, 'my gymm');

        res.map((r) => (gymId = r.g.gymId));

        console.log('ID->', gymId);

        if (res) {
          const r = await this.neo.write(`MATCH (u:User
    
     {userId:"${dto.userId}"}),(g:Gym {gymId:"${gymId}"})
    
     merge (u)-[o:OWNS {createdOn:"${Date.now()}"}]->(g) return o`);

          console.log('gym created successfully', r);

          return 'gym created successfully';
        } else {
          return 'failed to create gym due to invalid request';
        }
      }
    } catch (error) {
      console.log(error);

      throw new HttpException(error, 501);
    }
  }

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
      const res = await this.neo.read(
        `MATCH (g:Gym)-[r:LOCATED_IN]->(a:Address) return g,a`,
      );
      const gyms: Gym[] = [];
      res.map((r) => {
        gyms.push({ ...r['g'], address: r['a'] });
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
        `MATCH (u:User {userId: "${userId}"})-[:OWNS]->(g:Gym) 
        with g
        match (g)-[r:LOCATED_IN]->(a:Address) return g,a;`,
        { userId: userId },
      );
      const gyms: Gym[] = [];

      res.map((r) => gyms.push({ ...r['g'], address: r['a'] }));
      return gyms;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  async getGymAddress(id: string) {
    try {
      const res = await this.neo.read(
        `MATCH (g:Gym) where g.id=$id return g;`,
        { id: id },
      );
      const gyms: Gym[] = [];
      res.map((r) => gyms.push(r.g));
      return gyms;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }
  async findOne(id: string) {
    try {
      const res = await this.neo.read(
        `MATCH (g:Gym) WHERE g.id=${id} return g`,
        {
          id: id,
        },
      );
      let gym: Gym;
      console.log(res);
      if (res && res.length > 0) {
        res.map((r) => (gym = r.g));
        return gym;
      } else {
        return null;
        //throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' });
      }
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  async update(id: string, dto: UpdateGymDto) {
    console.log(id, dto);

    try {
      const res = await this.neo.write(`MATCH (g:Gym) 
      WHERE g.id="${id}" 
      SET
      g.name="${dto.name}",
      g.email="${dto.email}",
      g.panNo="${dto.panNo}",
      g.aadhar="${dto.aadhar}"
      
      return g
      `);

      console.log(res);
      return 'gym updated successfully';
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

  //#2nd Test
  // async remove(id: string) {
  //   try {
  //     const res = await this.neo.write(
  //       `MATCH (g:Gym) WHERE g.gymId=$id
  //     SET g.deleted=true
  //     return g
  //     `,
  //       { id: id },
  //     );
  //     console.log(res);
  //     return 'gym deleted successfully';
  //   } catch (error) {
  //     console.log(error);
  //     throw new HttpException('error deleteing gym', error);
  //   }
  // }

  //Temporary Running
  async remove(gymId: string) {
    try {
      console.log('Deleting Gym ID ->', gymId);

      const w1 = this.neo.write(
        `MATCH (g:Gym {gymId:"${gymId}"}) DETACH DELETE g `,
      );
   return w1;
    } catch (error) {
      console.log('Cannot Be Delete as Gym ID Not Found!', error);
      throw new NotFoundException();
    }
  }
  attachSvc(dto: CreateGymDto) {

    console.log('Attaching Service start...');




    const w1 = this.neo.write(`

        MATCH (g:Gym {gymId:"${dto.id}"}),(s:Service {svcId:"${dto.svcId}"})

        CREATE (g) - [:HAS_SERVICE] -> (s)

        RETURN g;

        `);

        console.log('Attaching Service Successfully!');

    return 'Attaching Service Successfully!'

  }
}
