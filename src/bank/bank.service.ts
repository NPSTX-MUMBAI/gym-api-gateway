import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';
import { UpdateGymDto } from 'src/gym/dto/update-gym.dto';

@Injectable()
export class BankService {
  constructor(private neo: Neo4jService) {}

  async create(dto: CreateBankDto) {
    try {
      let id: string;
      const createBank = await this.neo.write(`CREATE 
      (b:Bank  { 
        bankId:apoc.create.uuid(),
        accountHolderName:"${dto.accountHolderName}",
        accountNo:"${dto.accountNo}",
        accountType:"${dto.accountType}",
         name:"${dto.name}",
         branchName:"${dto.branchName}",
         ifsc:"${dto.ifsc}",
         mid:"${dto.mid}" }
         )
        return b;
      `);
      createBank.map((r) => {
        id = r.b.bankId;
        console.log('BankId-', id);
      });

      if (createBank) {
        const r = this.neo
          .write(`MATCH (g:Gym {gymId:"${dto.gymId}"}), (b:Bank {bankId:"${dto.bankId}"})
        merge (g)-[r:has_Bank]-> (b) return b`);
        console.log('Bank created successfully', r);
        return 'Bank created successfully';
      } else {
        return 'failed to create gym due to invalid request';
      }

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

    } catch (err) {
      console.log('Bank Error');
    }
  }

  //  #BS1  Not Running
  
  async getBankDetailsFromGymId(gymId: string) {
    console.log('Gym ID ->',gymId);
    
    try {
      let getDetails = await this.neo.read(`
      MATCH (b:Bank)-[a:HAS_ACCOUNT]-(g:Gym {gymId:"${gymId}"})
      RETURN b
            `);
            console.log(getDetails);
      return getDetails;
    } catch (error) {
      console.log('Bank Side Error...', error);
    }
  }

  async findAll() {
    try {
      console.log('Finding...');
      const banks = await this.neo.read(`MATCH (b:Bank) RETURN b`);
      const banklist: CreateBankDto[] = [];
      console.log('Banks', banklist);

      banks.map((r) => {
        banklist.push(r.b);
        console.log('[]-', r.b);
      });
      return banklist;
    } catch (err) {
      return new NotFoundException({}, 'Banks Not  Found!');
    }
  }

  async getBankDetailsById(id:string) {

    try {
    const r1 = await this.neo.read(
      `MATCH (b:Bank {bankId:"${id}"}) 
    RETURN b`)
    if(r1.length != 0) {
      return r1
    } else {

      throw new NotFoundException('Not Found');
    }

  } catch (err) {
    return err.response;
  }
  }

  // async getBankIds(id: String) {
  //   const bankDetails = await this.neo.read(`
  //   MATCH (b:Bank{bankId:"${id}"}) RETURN b as bank;
  //   `);
  //   console.log('In Bank -', bankDetails);
    
  //   return bankDetails;
  // }

  async update(id: string, dto: UpdateBankDto) {
    try {
      const res = await this.neo.write(`MATCH (b:Bank) where b.bankId="${id}" 
      SET
      b.accountHolderName="${dto.accountHolderName}",
      b.accountType="${dto.accountType}",
      b.accountNo = "${dto.accountNo}",
      b.bankname = "${dto.name}"
      b.branchname = "${dto.branchName}",
      return b
      `);
      return 'Gym updated successfully';
    } catch (error) {
      throw new HttpException('error updating gym', error);
    }
  }

  remove(id:string) {
    
    console.log("Deleting Gym Owner's Bank ID",id);

    const w1 = this.neo.write
    (`
    MATCH (b:Bank {bankId:"${id}"}) 
    DETACH DELETE b 
    `);
    console.log('Deleted Gym Owners Bank ID - ',id);
    return "Deleted Gym Owners Bank ID ";
  }
}