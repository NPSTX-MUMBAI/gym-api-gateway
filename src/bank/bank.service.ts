import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';

@Injectable()
export class BankService {
  constructor(private neo: Neo4jService) {}
  
  async create(dto:CreateBankDto) {

    try {
      // const q1 = this.neo.read('MATCH (u:User) RETURN u')
      // const q2 = this.neo.read('MATCH (g:Gym) RETURN g')
      // const q3 = this.neo.read('MATCH (m:Member) RETURN m')
      // const q4 = this.neo.read('MATCH (p:Package) RETURN p')
      // const q5 = this.neo.read('MATCH (s:Service) RETURN s')
      // const q6 = this.neo.read('MATCH (b:Bank) RETURN b')
      // const q7 = this.neo.read('MATCH (b:Bank),(u:User) RETURN b,u');

      let id :string;
     
      const res = await this.neo.write(`CREATE 
      (b:Bank  { 
        bankId:apoc.create.uuid(),
        accountHoldername:"${dto.accountHoldername}",
        accountNo:"${dto.accountNo}",
        accountType:"${dto.accountType}",
         bankname:"${dto.bankname}",
         branchname:"${dto.branchname}",
         ifsc:"${dto.ifsc}",
         mid:"${dto.mid}" })
        return b;
      `)
        res.map((r) => {
          id = r.b.bankId;
          console.log("BankId-",id);
      })

      // if (cq1) {
      //   console.log('Responsing from cq1..');
        
      //   const r = await this.neo
      //     .write(`MATCH (b:Bank{id:"${dto.id}"}),(u:User {bankId:"${id}"}) 
      //   merge (b)-[o:HAS_USER-ACC]->(u) return type(o)`)
      //   console.log('Bank Added successfully!', r);
      //   return 'Bank Added successfully';
      // } else {
      //   console.log('Failed');
        
      // }

    }
    catch(err) {
      console.log('Bank Error');
    }
  } 

 

  async findAll() {
    try {

      const banks = await this.neo.read(`MATCH (b:Bank) RETURN b`);
      const banklist:CreateBankDto[] = []

      console.log("Banks",banklist);
      

      banks.map((r) => {
        banklist.push(r.b)
      });
      return banklist;
      
    }
    catch(err) {
      return new NotFoundException({},'Bank Not Found Any User!');
    }
    

    
  }

  findOne(id: number) {
    return `This action returns a #${id} bank`;
  }

  update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
