import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
// import * as bcrypt from 'bcrypt';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { User } from 'src/models/user.model';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { mergeScan } from 'rxjs';
import { Gym } from 'src/gym/entities/gym.entity';
import { Member } from './entities/member.entity';
import * as crypto from 'crypto';
import { AuthService } from 'src/auth/auth.service';
import { USER_ROLE } from 'src/auth/dtos/signup.dto';
import { Address } from 'cluster';
import { log } from 'console';
import { CreateBodydto } from './dto/body-parameter.dto';
import { updateBodyparameter } from './dto/updateBody-parameter.dto';
import { CreatePlandto } from './dto/plan.dto';

@Injectable()
export class MemberService {
  constructor(private neo: Neo4jService, private authSvc: AuthService) {}

  // async create(dto: CreateMemberDto) {
  //   try {
  //     //       const memberExists = await this.neo
  //     // .read(`MATCH (u:Gym {gymId:"${dto.gymId}"})-[r: HAS_MEMBER {createdOn:"${Date.now()}"}]->(m:Member ) WHERE m.name="${dto.fullName}" AND g.email="${dto.email}"
  //     //     AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g `);

  //     const res = await this.authSvc.signup({
  //       userId: '',
  //       fullName: dto.fullName,
  //       email: dto.email,
  //       password: dto.password,
  //       mobileNo: dto.mobileNo,
  //       roles: [USER_ROLE.MEMBER],
  //       Address: [],
  //     });
  //     console.log(res, '#######');
  //     if (res.status === false) {
  //       return 'errorrrrrrrr';
  //     } else {
  //       //   const r = await this.neo.write(`match(g: Gym), (u: User)
  //       // where g.id = '${dto.gymId}'and u.email = '${dto.email}'
  //       // merge(g) - [r: HAS_MEMBER {createdOn:"${Date.now()}"}] -> (u) return u as user`);
  //       const r = await this.neo.write(`match(g: Gym), (u:User)
  //     where g.id = '${dto.gymId}'and u.email = '${dto.email}'
  //     merge(g) - [r: HAS_MEMBER {createdOn:"${Date.now()}"}] -> (u)
  //     with u
  //     merge (u)-[r:Has_Address]->(a:Address)
  //    set a+={
  //     line1:'${dto.address.line1}',
  //   line2: '${dto.address.line2}',
  //   locality: '${dto.address.locality}',
  //   city: '${dto.address.city}',
  //   state:'${dto.address.state}',
  //   country: '${dto.address.country}',
  //   pinCode: ${dto.address.pinCode}     }
  //     return u,a `);

  //       console.log(r);
  //       if (r.length > 0) {
  //         const name = 10;
  //         const nameArray: number[] = [];
  //         console.log(dto.services);
  //         dto.services.map(async (s) => {
  //           try {
  //             const query = await this.neo.write(`match(u:User), (s: Service)
  //         where u.email = '${dto.email}' and s.id = '${s.serviceId}'
  //         merge(u) - [r: HAS_SERVICE {createdOn:"${Date.now()}", rate:"${
  //               s.rate
  //             }",
  //         rateType:"${s.rateType}"}] -> (s) return u as user`);
  //             console.log(query);
  //           } catch (error) {
  //             console.log(error);
  //           }
  //         });

  //         return 'member created successfully';
  //         //return "member created successfully"
  //       } else {
  //         throw new HttpException(
  //           "could not create member and it's relation",
  //           402,
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new HttpException('error encountered', 402);
  //   }
  // }

  async create(dto: CreateMemberDto) {
    console.log(dto);

    try {
      const memberCheck = await this.neo.read(
        `MATCH (u:Gym {id:"${dto.id}"})-[r: HAS_MEMBER]->(m:User {fullName:"${dto.fullName}"}) return u`,
      );
      console.log('Member Found :', memberCheck);
      if (memberCheck.length == 0) {
        const res = await this.authSvc.signup({
          userId: '',
          fullName: dto.fullName,
          email: dto.email,
          password: dto.password,
          mobileNo: dto.mobileNo,
          roles: [USER_ROLE.MEMBER],
          Address: [],
        });
        console.log(res, 'member created');

        const createRealation = await this.neo.write(`match(g: Gym {id:"${
          dto.id
        }"}), (u:User {email:"${dto.email}"})
        merge(g) - [r: HAS_MEMBER {createdOn:"${Date.now()}"}] -> (u) 
        with u
      merge (u)-[r:Has_Address]->(a:Address)
      set a+={
      line1:"${dto.address.line1}",
    line2: "${dto.address.line2}",
    locality: "${dto.address.locality}",
    city: "${dto.address.city}",
    state:"${dto.address.state}",
    country: "${dto.address.country}",
    pinCode: "${dto.address.pinCode}" }
 with u
 set u +={
  gender:"${dto.gender}",
  startDate:"${dto.startDate}",
  endDate:"${dto.endDate}",
  aadharNo:"${dto.aadharNo}",
  discount:"${dto.discount}",
  disability:"${dto.disability}"
 }
 with u
 match(u), (s: Service)
  where u.email = "${dto.email}" and s.svcId = "${dto.svcId}"
          merge(u) - [r: HAS_SERVICE {createdOn:"${Date.now()}", rate:"${
          dto.rate
        }",rateType:"${dto.rateType}"}] -> (s)
                  return u,s`);

        console.log(createRealation);

        return { data: memberCheck, status: true, msg: 'relation builded' };
      } else {
        return { data: null, status: false, msg: 'one' };
      }
    } catch (error) {
      return { data: null, status: false };
    }
  }
  async findAll() {
    try {
      const res = await this.neo.read(
        `MATCH (u:User) where ANY (x in u.roles WHERE x= 'MEMBER') return u `,
      );
      // const res = await this.neo.read(`MATCH (u:Member)  return u `);
      const res1 = await this.neo.read(`
      MATCH (u:User) RETURN u;
      `);

      res.map((r) => {
        console.log(r);
      });
      return res;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  async findmemberbygymID(id: any) {
    console.log(id);

    try {
      const res = await this.neo.read(
        ` MATCH (g:Gym {id: "${id}"})-[e:HAS_MEMBER]->(u:User)
with g,u
match (g)-[r:LOCATED_IN]->(a:Address)
return u,a `,
      );
      console.log(res);

      let member: Member[] = [];

      if (res.length > 0) {
        member = res.map((r) => (member = { ...r.u, address: r.a }));
        return member;
      } else {
        return null;
      }
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  async update(id: string, dto: UpdateMemberDto) {
    try {
      const res = await this.neo.write(`MATCH (u:User) where u.userId="${id}" 
      SET
      u.email="${dto.email}",
      u.fullName="${dto.fullName}",
      
      u.mobileNo="${dto.mobileNo}"
      return u
      `);
      return 'member updated successfully';
    } catch (error) {
      throw new HttpException('error updating member', error);
    }
  }

  async remove(id: string): Promise<{ status: boolean; msg: string }> {
    try {
      console.log('Deleting Member ID - ', id);

      const res = await this.neo.write(
        `MATCH (u:User {userId:"${id}"}) DETACH DELETE u`,
      );
      return { status: true, msg: 'member deleted successfully' };
    } catch (error) {
      throw new HttpException('error', error);
    }
  }

  async addbodyParameters(dto: CreateBodydto) {
    try {
      const res = await this.neo.write(
        // `MATCH (u:User {userId: "${dto.userId}"})-[p:BODY_PARAMETERS]-> (b:body {height:"${dto.height}", weight:"${dto.weight}"})  return u`,

        `CREATE(b:Body {
    
    bodyId:apoc.create.uuid(), height:"${dto.height}",weight:"${dto.weight}",neck:"${dto.neck}",chest:"${dto.chest}",shoulder: "${dto.shoulder}",biceps: "${dto.biceps}",waist: "${dto.waist}",hips: "${dto.hips}",
    thighs: "${dto.thighs}",
    rightarmFLex:  "${dto.rightarmFlex}",
    leftarmFlex:  "${dto.leftarmFlex}",
    calves:   "${dto.calves}"})
    
    with b
    
     MATCH (u:User {userId:"${dto.userId}"})
    
     merge (u)-[:HAS_BODYPARAMETER]-> (b)
    
    return u, b`,
      );

      console.log(res);

      return 'BodyParameters Added Successfully';
    } catch (error) {
      throw new HttpException('error', error);
    }
  }

  async updateBody(id: any, dto: updateBodyparameter) {
    try {
      console.log('BOOODYY', id);

      const res = await this.neo
        .write(`MATCH (u:User {userId: "${dto.memberId}"})-[:HAS_BODYPARAMETER]->(b:Body{bodyId:"${id}"})
    
    SET b.chest="${dto.chest}"
    
    SET b.height="${dto.height}"
    
    SET b.weight="${dto.weight}"
    
    SET b.neck= "${dto.neck}"
    SET b.shoulder= "${dto.shoulder}"
    SET b.biceps= "${dto.biceps}"
    SET b.waist= "${dto.waist}"
    SET b.hips= "${dto.hips}"
    SET b.thighs= "${dto.thighs}"
    SET b.rightarmFLex = "${dto.rightarmFlex}"
    SET b.leftarmFlex = "${dto.leftarmFlex}"
    SET b.calves =  "${dto.calves}"
     return b,u
    `);

    console.log(res);

    return 'updated successfully';
  } catch (error) {
    throw new HttpException('error updating BodyParameters', error);
  }
}
async findBodyParameterbyMemberId(userId: any) {
  console.log(userId);

  try {
    const res = await this.neo.read(
      ` MATCH (u:User {userId: "${userId}"})-[:HAS_BODYPARAMETER]->(b: Body) return b`,
    ); // const hey = res.data.map((res) => res.get('m').properties);\

    const array = [];

    for (let i = 0; i < res.length; i++) {
      array.push(res[i].b);

      console.log('bodddyParameter', array);
    }

    return array;
  } catch (error) {
    throw new HttpException('error encountered', error);
  }
}
  async attachserivcetomember(dto: CreateMemberDto) {
    try {
      const serviceCheck = await this.neo.read(
        `MATCH (u:User {userId:"${dto.userId}"}) - [r: SUBSCRIBED_TO] -> (s:Service) WHERE s.svcId="${dto.svcId}"  return u,s`,
      );

      console.log('Service  Found :', serviceCheck);

      if (serviceCheck.length > 0) {
        throw new ConflictException('Service  already attached To Member');
      } else {
        const res = await this.neo.write(
          ` MATCH (u:User),(s:Service)

          WHERE u.userId='${dto.userId}' AND s.svcId='${dto.svcId}'

          MERGE (u) - [:SUBSCRIBED_TO {createdOn:'${Date.now()}'}] -> (s)

         return u; `,
        );

        return 'service associated with MEMBER successfully';
      }
    } catch (error) {
      console.log(error);

      throw new HttpException(error, 501);
    }
  }

  async adddurationPlan(dto: CreatePlandto) {
    try {
      const DurationCheck = await this.neo.read(
        `MATCH (p:Plan {planName:"${dto.planName}"})  return p`,
      );

      console.log('DurationFound :', DurationCheck);

      if (DurationCheck.length > 0) {
        throw new ConflictException('Duration Name already Exists');
      } else {
        const res = await this.neo.write(
          `CREATE(p:Plan {

         planId :apoc.create.uuid(), planName:"${dto.planName}"})




         return  p`,
        );

        return { res };
      }
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }

  async getAllduration() {
    try {
      const res = await this.neo.read(`MATCH (p:Plan) return p`);

      const plan: CreatePlandto[] = [];

      res.map((r) => {
        plan.push({ ...r['p'] });
      });

      console.log(plan);

      return plan;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }
  async attachplantomember(dto: CreatePlandto) {
    try {
      const planCheck = await this.neo.read(
        `MATCH (u:User {userId:"${dto.userId}"}) - [r: Has_Duration] -> (p:Plan) WHERE p.planId="${dto.planId}"  return u,p`,
      );

      console.log('Plan  Found :', planCheck);

      if (planCheck.length > 0) {
        throw new ConflictException('duration  already attached To Member');
      } else {
        const res = await this.neo.write(
          ` MATCH (u:User),(p:Plan)

          WHERE u.userId='${dto.userId}' AND p.planId='${dto.planId}'

          MERGE (u) - [:SUBSCRIBED_TO {createdOn:'${Date.now()}'}] -> (p)

         return u `,
        );

        return 'Duration  associated with MEMBER successfully';
      }
    } catch (error) {
      console.log(error);

      throw new HttpException(error, 501);
    }
  }
  

  async attachServicesMEM(dto: any) {

    try {

      let query;

      let i;

      for (i = 0; i < dto.services.length; i++) {

        query = await this.neo.write(

          `MATCH (u:User {userId: "${dto.userId}"}), (s:Service {svcId: "${dto.services[i].svcId}"})

MERGE (u)-[r:SUBSCRIBED_TO {rate: "${dto.services[i].rate}"}]->(s)

SET u.amount = '${dto.amount}',

    u.discount = "${dto.discount}",

    u.totalAmount = "${dto.totalAmount}"

WITH u, s, r  

   MATCH (u:User {userId: "${dto.userId}"}), (p:Plan {planName: "${dto.duration.planName}"}  )

MERGE (u)-[t:SELECTED_PLAN]->( p) SET p.planName = '${dto.duration.planName}'

RETURN u, s, r, t`,

        );

      }




      if (query.length > 0) {

        return { data: query, msg: 'Services', status: true };

      } else {

        return { data: null, msg: 'Error Service Not Found', status: false };

      }

    } catch (error) {

      console.log(error);

      return error;

    }

  }
  
}
