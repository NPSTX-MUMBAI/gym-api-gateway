import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';

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
         mid:"${dto.mid}" })
        return b;
      `);
      createBank.map((r) => {
        id = r.b.bankId;
        console.log('BankId-', id);
      });
       if(createBank){
        const r = this.neo.write(`MATCH (g:Gym {gymId:"${dto.gymId}"}), (b:Bank {bankId:"${dto.bankId}"})
        merge (g)-[r:has_Bank]-> (b) return b`)
        console.log('Bank created successfully', r);
        return 'Bank created successfully';
       }else{
        return 'failed to create gym due to invalid request';
       }
      } catch (err) {
        console.log('Bank Error');
      }
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

      //Bug
      async create1(dto: CreateBankDto) {
        try {
    
          const bankExist = await this.neo
          .read(`MATCH (g:Gym {id:"${dto.id}"})-[a:HAS_ACCOUNT]->(b:Bank) WHERE 
          b.name="${dto.name}" AND b.accountNo="${dto.accountNo}" 
        AND b.accountType="${dto.accountType}" AND b.brachName="${dto.branchName}" return b `);

          console.log("BankExist ? -",bankExist);

          let id: string;
          
          let gymId:String;

          const createBank = await this.neo.write(`CREATE 
          (b:Bank  { 
            bankId:apoc.create.uuid(),
            accountHolderName:"${dto.accountHolderName}",
            accountNo:"${dto.accountNo}",
            accountType:"${dto.accountType}",
             name:"${dto.name}",
             branchName:"${dto.branchName}",
             ifsc:"${dto.ifsc}",
             mid:"${dto.mid}" })
            return b;
          `);
          createBank.map((r) => {
            id = r.b.bankId;

            console.log('BankId-', id);
          });
           if(createBank){
            const r = this.neo.write(`MATCH (g:Gym {gymId:"${dto.gymId}"}), (b:Bank {bankId:"${dto.bankId}"})
            merge (g)-[r:has_Bank]-> (b) return b`)
            console.log('Bank created successfully', r);
            return 'Bank created successfully';
           }else{
            return 'failed to create gym due to invalid request';
           }
          } catch (err) {
            console.log('Bank Error');
          }
        }



  //  #BS1 
  getBankDetailsFromGymId(gymId:string) {
    try {
      let getDetails = this.neo.read(`
      MATCH (b:Bank )-[a:HAS_ACCOUNT]->(g:Gym {id:"${gymId}"})
      RETURN b
            `)
      return getDetails;

  } catch (error) {
      console.log('Bank Side Error...',error);
      
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

  async getBanknames() {
    try {
      const banknames = await this.neo.read(`MATCH (b:Bank) RETURN b`);
      const banklist: CreateBankDto[] = [];

      banknames.map((r) => {
        banklist.push(r.b.bankName);
      });
      console.log('banklist-', banklist);

      return banklist;
    } catch (err) {
      console.log('', err);
    }
  }

  async getBankIds(id: String) {
    const bankDetails = await this.neo.read(`
    MATCH (b:Bank{bankId:"${id}"}) RETURN b as bank;
    `);
    console.log('In Bank -', bankDetails);

    return bankDetails;
  }

  // async findByGymId(id:String) {
  //   const bankDetails = await this.neo.read(`
  //   MATCH (b:Bank {}) RETURN b as bank
  //   `)
  // }





  update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
