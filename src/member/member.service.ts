import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as bcrypt from 'bcrypt';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { User } from 'src/models/user.model';
import { NotFoundException } from '@nestjs/common/exceptions';
import { mergeScan } from 'rxjs';
import { Gym } from 'src/gym/entities/gym.entity';
import { Member } from './entities/member.entity';
import * as crypto from 'crypto';

@Injectable()
export class MemberService {
  constructor(private neo: Neo4jService) {}
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

  async create(dto: CreateMemberDto) {
    try {
      //step to check if the member exists

      const memberQuery = await this.neo
        .read(`MATCH (g:Gym)-[:HAS_MEMBER]->(m:Member) where g.gymId="${dto.gymId}" 
      and m.email="${dto.email}" and m.mobileNo="${dto.mobileNo}" and m.firstName="${dto.firstName}" return m`);

      if (memberQuery.length > 0) {
        memberQuery.map((row) => console.log(row));
        throw new BadRequestException('user already exists');
      }

      const memberId = crypto.randomUUID();

      const encryptedPassword = bcrypt.hashSync(dto.password, 10);

      const query = await this.neo.write(`
      MERGE (m:Member {firstName:"${dto.firstName}",
      lastName:"${dto.lastName}", 
      email:"${dto.email}",
      mobileNo:"${dto.mobileNo}",
      password:"${dto.password}",
      memberId:"${memberId}"}) 
      return m
      union
      match (g:Gym),(m:Member)
      where g.gymId='${dto.gymId}'and m.email='${dto.email}'
      merge(g)-[r:HAS_MEMBER]->(m) return m`);

      console.log('GymID->', dto.gymId);
      console.log('MemberID->', dto.memberId);

      return { data: query, msg: 'ok' };
    } catch (error) {
      return new HttpException(error, 503);
    }
  }

  async findAll() {
    try {
      // const res = await this.neo.read(`MATCH (u:User) where ANY (x in u.roles WHERE x= 'MEMBER') return u `)
      const res = await this.neo.read(`MATCH (u:Member)  return u `);

      res.map((r) => {
        console.log(r);
      });
      return res;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} member`;
  // }

  async findmemberbygymID(id: CreateMemberDto) {
    try {
      const res = await this.neo.read(
        `MATCH (n: Member{gymId: "${id}"}) return n`,
      );
      let member: Member[] = [];
      console.log(res);
      if (res && res.length > 0) {
        member = res.map((r) => (member = r.n));
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
      const res = await this.neo.write(`MATCH (u:User) where u.id="${id}" 
      SET
      u.email="${dto.email}",
      u.firstName="${dto.firstName}",
      u.lastName="${dto.lastName}",
      u.mobileNo="${dto.mobileNo}"
      return u
      `);
      return 'member updated successfully';
    } catch (error) {
      throw new HttpException('error updating member', error);
    }
  }

  async remove(id: string) {
    try {
      const res = await this.neo.write(
        `MATCH (u:User {id:"${id}"}) DETACH DELETE u`,
      );
      return 'member deleted successfully';
    } catch (error) {
      throw new HttpException('error', error);
    }
  }
}
