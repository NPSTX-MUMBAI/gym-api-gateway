import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as bcrypt from 'bcrypt';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { User } from 'src/models/user.model';
import { NotFoundException } from '@nestjs/common/exceptions';
import { mergeScan } from 'rxjs';
import { AppController } from 'src/app.controller';

import { IsUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'domain';


@Injectable()
export class MemberService {
  constructor(private neo: Neo4jService) {

  }
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



  // Constraint on Mobile Number
  async create2(dto:CreateMemberDto) {

    // const createPassword = bcrypt.hashSync(dto.password);

    // console.log('EN Pass', createPassword);
    

    const createMember = await this.neo.write(`
    CREATE (m:Member {
      memberId:apoc.create.uuid(),
      firstName :"${dto.firstName}",
      lastName :"${dto.lastName}",
      mobileNo :"${dto.mobileNo}",
      password :"${dto.password}",
      roles :"${dto.roles}"
    })
    RETURN m
    `)
    
    createMember.map((res) => {
      const memberId = res.m.memberId;
      console.log("Member ID - ",memberId);
      
    })

    return createMember;

  }

  


  async findAll() {

    try {
      const res = await this.neo.read(`MATCH (u:User) where ANY (x in u.roles WHERE x= 'MEMBER') return u `)

      res.map(r => {
        console.log(r);
      })
      return res;

    } catch (error) {
      throw new NotFoundException();
    }
  }

  findOne(id: string) {
    // return `This action returns a #${id} member`;

    const r1 = this.neo.read(`
    MATCH (u:Member {memberID:"${id}"})
    RETURN u.userId;
    `)

    return r1;
  }

  async update(id: string, dto: UpdateMemberDto) {
    try {
      const res = await this.neo.write(`MATCH (u:User) where u.id="${id}" 
      SET
      u.email="${dto.email}",
      u.firstName="${dto.firstName}",
      u.lastName="${dto.lastName}",
      u.mobileNo="${dto.mobileNo}"
      return u
      `)
      return "member updated successfully";
    } catch (error) {
      throw new HttpException("error updating member", error)
    }
  }

  remove(id: string) {
    console.log('Deleting Member ID Is', id);

    const w1 = this.neo.write(`
    MATCH (m:Member {memberId:"${id}"}) 
    DETACH DELETE m
    `);
    console.log('Deleted Gym ID Is - ', id);
    return 'Deleted Gym Member Successfully! ';
  }
}


