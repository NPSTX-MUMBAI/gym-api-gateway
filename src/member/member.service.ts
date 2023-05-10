import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
// import * as bcrypt from 'bcrypt';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { User } from 'src/models/user.model';
import { NotFoundException } from '@nestjs/common/exceptions';
import { mergeScan } from 'rxjs';
import { Gym } from 'src/gym/entities/gym.entity';
import { Member } from './entities/member.entity';
import * as crypto from 'crypto';
import { AuthService } from 'src/auth/auth.service';
import { USER_ROLE } from 'src/auth/dtos/signup.dto';
import { Address } from 'cluster';
import { log } from 'console';

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
      merge (u {email:"${dto.email}"})-[r:Has_Address]->(a:Address)
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

        return { data: createRealation, status: true, msg: 'relation builded' };
      } else {
        return { data: null, status: false, msg: 'one' };
      }
    } catch (error) {
      return { data: null, status: false };
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
