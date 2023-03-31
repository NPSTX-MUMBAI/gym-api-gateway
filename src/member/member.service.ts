import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as bcrypt from 'bcrypt';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { User } from 'src/models/user.model';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class MemberService {
  constructor(private neo: Neo4jService) {

  }
  async create(dto: CreateMemberDto) {
    try {
      const encryptedPassword = bcrypt.hashSync(dto.password, 10);
      const roles = ['MEMBER'];

      const query = `CREATE (u:User {firstName:"${dto.firstName}",lastName:"${dto.lastName}",email:"${dto.email}",
            mobileNo:"${dto.mobileNo}", password:"${encryptedPassword}"
        }) SET u.roles = $roles, u.id=apoc.create.uuid() return u
        ` ;
      const params = { roles: roles };
      const res = await this.neo.write(query, params);
      let member: User;
      if (res.length > 0) {
        res.map(r => {
          console.log("memebr=>", r.u);
          member = r.u;
        })

        let c = await this.neo.write(`MATCH (g:Gym),(u:User) WHERE g.id="${dto.gymId}" AND u.id="${member.id}" CREATE (g)-[r:HAS_MEMBER]->(u) return u`);
        console.log(c);
        return "member created successfully";
      } else {
        throw new BadRequestException("failed to create member in the database");
      }

    } catch (error) {
      return new HttpException(error, 503);
    }
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

  findOne(id: number) {
    return `This action returns a #${id} member`;
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

  async remove(id: string) {
    try {
      const res = await this.neo.write(`MATCH (u:User {id:"${id}"}) DETACH DELETE u`);
      return "member deleted successfully";

    } catch (error) {
      throw new HttpException("error", error)
    }
  }
}
