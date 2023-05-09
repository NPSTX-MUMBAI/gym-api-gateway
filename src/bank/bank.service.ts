import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

      console.log(dto);
      let id:string;
      

      const createBank = await this.neo.write(`CREATE 
      (b:Bank  { 
        bankId:apoc.create.uuid(),
        accountHolderName:"${dto.accountHolderName}",
        accountNo:"${dto.accountNo}",
        accountType:"${dto.accountType}",
         bankName:"${dto.bankName}",
         branchName:"${dto.branchName}",
         ifsc:"${dto.ifsc}",
         gymId:"${dto.gymId}",
         mid:"${dto.id}" })
        return b;
      `);

     
       if(createBank){

        createBank.map((r) => {
          id = r.b.bankId;
          console.log('BankId-', id);
        });

        
        const r = await this.neo.write(`MATCH (g:Gym {id:"${dto.id}"}), (b:Bank {bankId:"${dto.bankId}"})
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
      // async create1(dto: CreateBankDto) {
      //   try {
    
      //     const bankExist = await this.neo
      //     .read(`MATCH (g:Gym {id:"${dto.id}"})-[a:HAS_ACCOUNT]->(b:Bank) WHERE 
      //     b.bankName="${dto.bankName}" AND b.accountNo="${dto.accountNo}" 
      //   AND b.accountType="${dto.accountType}" AND b.brachName="${dto.branchName}" return b `);

      //     console.log("BankExist ? -",bankExist);

      //     let id: string;
          
      //     let gymId:String;

      //     const createBank = await this.neo.write(`CREATE 
      //     (b:Bank  { 
      //       bankId:apoc.create.uuid(),
      //       accountHolderName:"${dto.accountHolderName}",
      //       accountNo:"${dto.accountNo}",
      //       accountType:"${dto.accountType}",
      //        bankName:"${dto.bankName}",
      //        branchName:"${dto.branchName}",
      //        ifsc:"${dto.ifsc}",
      //        mid:"${dto.mid}" })
      //       return b;
      //     `);
      //     createBank.map((r) => {
      //       id = r.b.bankId;

      //       console.log('BankId-', id);
            
      //        });
      //      if(createBank){
      //       const r = this.neo.write(`MATCH (g:Gym {gymId:"${dto.gymId}"}), (b:Bank {bankId:"${dto.bankId}"})
      //       merge (g)-[r:has_Bank]-> (b) return b`)
      //       console.log('Bank created successfully',r);
      //       return 'Bank created successfully';
      //      }else{
      //       return 'failed to create gym due to invalid request';
      //      }
      //     } catch (err) {
      //       console.log('Bank Error');
      //     }
      //   }



  //  #BS1 
  getBankDetailsFromGymId(gymId:string) {
    try {
      let getDetails = this.neo.read(`
      MATCH (b:Bank )-[a:HAS_ACCOUNT]-(g:Gym {gymId:"${gymId}"})
      RETURN b
            `).then((res) => {
              console.log("Inside Promise",res);
              
            })
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

  update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  //1st Test
  // async remove(id: string) {
  //   let bankList : CreateBankDto[] = [];

  //   try {
  //     //1   Getting Bank Details From Bank ID
  //     let bankDetails = await this.neo
  //       .read(
  //         `
  //   MATCH (b:Bank {bankId:"${id}"}) 
  //   RETURN b
  //   `,
  //       )
  //       .then((detail) => {
  //         console.log('res', detail);
  //       });

  //     //2   Finding Relation Related to the Bank  
  //     //(HAS_ACCOUNT)
  //     let findBankRelation = await this.neo.read(`
  //     MATCH (b:Bank {bankId:"${id}"}) - [a:HAS_ACCOUNT] - (g:Gym)
  //     RETURN type(a);
  //     `)
  //     .then((res) => {
  //       console.log("Res",res);
  //       // Type(a) can be dynamic here

  //       //  Passing Bank ID, Getting type
  //       if(res[0]['type(a)'] == 'HAS_ACCOUNT') {
  //         console.log('Getting Relation HAS_ACCOUNT...',res);
  //         this.neo.write(`
  //         MATCH (b:Bank {bankId:"${id}"}) - [a:HAS_ACCOUNT] - (g:Gym) 
  //         DETACH DELETE b 
  //         `)
  //         // let deleteBank = this.neo.write(`
  //         // MATCH (b:Bank {bankId:"${id}"}) - [a:HAS_ACCOUNT] - (g:Gym) 
  //         // DETACH DELETE b
  //         // `).then((log) => {
  //         //   console.log("Deleted ....",log);
  //         // })
  //       }
  //        else {
  //         console.log('Cannot find Relation');
  //       }
  //     })

  //   } catch (error) {
  //     console.log('Bank Side Error', error);
  //   }
  // }

  remove(id: string) {
    console.log("Deleting Gym Owner's Bank ID", id);

    const w1 = this.neo.write(`
    MATCH (b:Bank {bankId:"${id}"}) 
    DETACH DELETE b 
    `);
    console.log('Deleted Gym Owners Bank ID - ', id);
    return 'Deleted Gym Owners Bank ID ';
  }
}
