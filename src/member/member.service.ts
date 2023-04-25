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
import { AuthService } from 'src/auth/auth.service';
import { USER_ROLE } from 'src/auth/dtos/signup.dto';

@Injectable()
export class MemberService {
  constructor(private neo: Neo4jService, private authSvc: AuthService) { }

 

  async create(dto: CreateMemberDto) {
    console.log(dto);
    

    try {

      const res = await this.authSvc.signup({ userId: "", fullName: dto.fullName, email: dto.email, password: dto.password, mobileNo: dto.mobileNo, roles: [USER_ROLE.MEMBER], })
      console.log(res)
      

      const r = await this.neo.write(`match(g: Gym), (u: User)
      where g.id = '${dto.gymId}'and u.email = '${dto.email}'
      merge(g) - [r: HAS_MEMBER {createdOn:"${Date.now()}"}] -> (u) return u as user`);
      console.log(r);
      if (r.length > 0) {

        const name: number = 10;
        const nameArray: number[] = [];
          console.log(dto.services)
        dto.services.map(async (s) => {

          try {

            const query = await this.neo.write(`match(u:User), (s: Service) 
          where u.email = '${dto.email}' and s.id = '${s.serviceId}'
          merge(u) - [r: HAS_SERVICE {createdOn:"${Date.now()}", rate:"${s.rate}", 
          rateType:"${s.rateType}"}] -> (s) return u as user`);
            console.log(query);
          } catch (error) {
            console.log(error);
          }
        });

        return "member created successfully"
        //return "member created successfully"

      } else {
        throw new HttpException("could not create member and it's relation", 402);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException("error encountered", 402);

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
      u.fullName="${dto.fullName}",
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
