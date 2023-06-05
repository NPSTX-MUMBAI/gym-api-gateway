import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
// import * as bcrypt from 'bcrypt';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { User } from 'src/models/user.model';
import { NotFoundException } from '@nestjs/common/exceptions';
import { mergeScan } from 'rxjs';
import { AppController } from 'src/app.controller';

import { IsUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'domain';
import { AuthService } from 'src/auth/auth.service';
import { USER_ROLE } from 'src/auth/dtos/signup.dto';
import { Address } from 'cluster';
import { log } from 'console';
import { CreateBodydto } from './dto/body-parameter.dto';
import { updateBodyparameter } from './dto/updateBody-parameter.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(private neo: Neo4jService, private authSvc: AuthService) { }


  //1st Attempt
  // async create(dto: CreateMemberDto) {
  //   try {
  //     const encryptedPassword = bcrypt.hashSync(dto.password, 10);
  //     const query= await this.neo.write(`merge (m:member {firstName:"${dto.firstName}",
  //     lastName:"${dto.lastName}",
  //     email:"${dto.email}",
  //     mobileNo:"${dto.mobileNo}",
  //     password:"${dto.password}"
  //   ,memberId:"${dto.memberId}" }) 
  //    return m
  //    union
  //    merge(g:gym {gymId: "${dto.gymId}"})-[r:HAS_MEMBER]->(m:member{memberId:"${dto.memberId}"}) return m`);

  //   return { data: query, msg:"ok"}
  //   } catch (error) {
  //     return new HttpException(error, 503);
  //   }
  // }

  // async create(dto: CreateMemberDto) {
  //   try {

  //     const encryptedPassword = bcrypt.hashSync(dto.password, 10);

  //     console.log("EN PASS - ",encryptedPassword);


  //     const query= await this.neo.write(`
  //     CREATE (m:Member {
  //     firstName:"${dto.firstName}",
  //     lastName:"${dto.lastName}", 
  //     email:"${dto.email}",
  //     mobileNo:"${dto.mobileNo}",
  //     password:"${dto.password}"
  //   }) 
  //     return m
  //     union
  //     merge(g:gym {id: "${dto.gymId}"})-[r:HAS_MEMBER]->(m:member{memberId:"${dto.memberId}"}) return m`);

  //     console.log("GymID->",dto.gymId);
  //     console.log("MemberID->",dto.memberId);

  //   return { data: query, msg:"ok"}
  //   } catch (error) {
  //     return new HttpException(error, 503);
  //   }
  // }

  //   async create1(dto: CreateMemberDto) {
  //   try {

  //     const encryptedPassword = bcrypt.hashSync(dto.password, 10);

  //     console.log("EN PASS - ",encryptedPassword);


  //     const query= await this.neo.write(`
  //     CREATE (m:Member {
  //     firstName:"${dto.firstName}",
  //     lastName:"${dto.lastName}", 
  //     email:"${dto.email}",
  //     mobileNo:"${dto.mobileNo}",
  //     password:"${dto.password}"
  //   }) 
  //     return m
  //     union 
  //     merge(g:Gym {id: "${dto.gymId}"})-[r:HAS_MEMBER]->(m:member{memberId:"${dto.memberId}"}) return m`);

  //     console.log("GymID->",dto.gymId);
  //     console.log("MemberID->",dto.memberId);

  //   return { data: query, msg:"ok"}
  //   } catch (error) {
  //     return new HttpException(error, 503);
  //   }
  // }



  async create(dto: CreateMemberDto) {
    console.log(dto);

    try {

      let memberId: string;
      const createMember = await this.neo.write(`
    CREATE (m:Member {
      memberId:apoc.create.uuid(),
      fullName:"${dto.fullName}",
      mobileNo :"${dto.mobileNo}",
      email :"${dto.email}",
      password :"${dto.password}",
      roles :"${dto.roles}"
    })
    RETURN m
    `)



      if (createMember.length > 0) {
        createMember.map((res) => {
          memberId = res.m.memberId;
          console.log('Member ID ', memberId);

        })


        const linkSvc = this.neo.write(`
      MATCH (m:Member {memberId:"${memberId}"}),(s:Service {svcId:"${dto.svcId}"}) 
      MERGE (m) - [r:ASSOCIATE {svcId:"${dto.svcId}"}] -> (s)
      RETURN m`);

        return linkSvc
      }


    }
    catch (error) {
      console.log('', error);
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
}
