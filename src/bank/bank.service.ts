import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';
import { UpdateGymDto } from 'src/gym/dto/update-gym.dto';
import { linkGymidToBank } from './dto/map-bankwithgym.dto';
import { create } from 'domain';



@Injectable()
export class BankService {
  constructor(private neo: Neo4jService) { }

  // async create(dto: CreateGymDto) {
  //   try {
  //     //step1: first check if the bank exists
  //     const gymExists = await this.neo
  //       .read(`
  //       MATCH (u:User
  //         {email:"${dto.createdBy}"})-[o:OWNS]->(g:Gym )
  //         WHERE
  //         g.gymName="${dto.name}" AND g.email="${dto.email}"
  //         AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g
  //     `);

  //     console.log('gym=>', gymExists);
  //     if (gymExists.length > 0) {
  //       throw new ConflictException(
  //         'gym exists with the same name for the same user',
  //       );
  //     } else {

  //       let id: string;
  //       const res = await this.neo.write(`CREATE
  //       (g:Gym { id: apoc.create.uuid() ,
  //         name:"${dto.name}",

  //     email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})
  //     MERGE (a:Address {line1:"${dto.address.line1}",
  //       line2:"${dto.address.line2}", locality:"${dto.address.locality}",
  //       city:"${dto.address.city}",state:"${dto.address.state}",
  //       country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"})
  //       MERGE (g)-[r:LOCATED_IN]->(a) return a,g
  //    `);
  //       res.map((r) => {
  //         id = r.g.gymId;
  //         console.log('ID->', id);
  //       });
  //       if (res) {
  //         const r = await this.neo
  //           .write(`MATCH (u:User{id:"${dto.id}"}),(g:Gym {gymId:"${id}"})
  //         merge (u)-[o:OWNS]->(g) return o`);
  //       console.log('gym created successfully', r);
  //         return 'gym created successfully';
  //       } else {
  //         return 'failed to create gym due to invalid request';
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new HttpException(error, 501);
  //   }
  // }



  gymList: CreateGymDto[] = [];
  selectedGym: CreateGymDto[] = [];

  linkGymId(id: string, bankDto: CreateBankDto) {
    console.log('Gym ID - ', id);

    const r1 = this.neo
      .read(
        `
    MATCH (g:Gym) WHERE g.id = "${id}"
    RETURN g;
    `,
      )
      .then((r1res) => {
        console.log('Gym ID Wise Bank Details', r1res);

        const r2 = this.neo
          .read(
            `
      MATCH (b:Bank) WHERE b.bankId = "${bankDto.bankId}"
      RETURN b;
      `,
          )
          .then((r2res) => {
            console.log('Bank ID Wise Bank Details', r2res);
            //
            const w1 = this.neo
              .write(
                `
        MATCH (g:Gym),(b:Bank) WHERE g.id = "${id}" 
        AND b.bankId = "${bankDto.bankId}"
        CREATE (g) - [r:HAS_ACCOUNT] -> (b) 
        RETURN g,b
        `,
              )
              .then((r3res) => {
                console.log('Setting Gym ID to the Bank', r3res);
              });
          });
      });

    if (r1) {
      console.log('======');
    }

    return r1;
  }

  //  #BS1  Not Running

  async getBankDetailsFromGymId(gymId: string) {
    console.log('Gym ID ->', gymId);
  }


  async create(Dto: CreateBankDto): Promise<any> {
    const bankId = crypto.randomUUID();
    return new Promise(async (resolve) => {
      try {
        await this.neo.write(
          `merge (b:Bank {accountHolderName: "${Dto.accountHolderName}",
accountType: "${Dto.accountType}",
accountNo: "${Dto.accountNo}",
ifsc: "${Dto.ifsc}",
vpa: "${Dto.vpa}",
bankName: "${Dto.name}",
branchName: "${Dto.branchName}",
bankId:"${bankId}"})
return b`,
        );
        const res = await this.neo
          .write(`MATCH (g:Gym),(p:Bank) WHERE g.gymId="${Dto.gymId
            }" AND p.bankId="${bankId}"
        CREATE (g) - [r:HAS_ACCOUNT {createdOn:"${Date.now()}"}] -> (p) RETURN g,p,r`);

        if (res.length > 0) {
          res.map((r) => {
            console.log(r);
            resolve({ status: true, msg: 'SUCCESS', statusCode: 201 });
          });
        } else {
          throw new BadRequestException();
        }
        resolve({ status: true, msg: 'SUCCESS', statusCode: 201 });
      } catch (error) {
        resolve({ status: false, msg: 'FAILED to generate response' });
      }
    });
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
      return new NotFoundException({}, 'Banks Not Found!');
    }
  }

  async getBankDetailsById(id: string) {
    try {
      const r1 = await this.neo.read(
        `MATCH (b:Bank {bankId:"${id}"}) 
    RETURN b`,
      );
      if (r1.length != 0) {
        return r1;
      } else {
        HttpException;
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
      b.bankName = "${dto.bankName}",
      b.branchName = "${dto.branchName}"
      return b
      `);
      return 'Gym updated successfully';
    } catch (error) {
      throw new HttpException('error updating gym', error);
    }
  }

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
