import { Injectable } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Neo4jService } from '@brakebein/nest-neo4j';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BankService {
  constructor(private neo: Neo4jService) {}

  async create(Dto: CreateBankDto): Promise<any> {
    const bankId = crypto.randomUUID();
    return new Promise(async (resolve) => {
      try {
        await this.neo.write(
          `merge (b:bank {accountHolderName: "${Dto.accountHolderName}",
accountType: "${Dto.accountType}",
accountNo: "${Dto.accountNo}",
ifsc: "${Dto.ifsc}",
mid: "${Dto.mid}",
bankName: "${Dto.bankName}",
branchName: "${Dto.branchName}",
bankId:"${bankId}"})
return b`,
        );
        await this.neo.write(
          `MATCH (g:Gym),(p:bank) WHERE
        g.gymId="${Dto.gymId}" AND p.bankId="${bankId}"
        CREATE (g) - [r:HAS_BANK_ACCOUNT] -> (p) RETURN g,p`,
        );
        resolve({ status: true, msg: 'SUCCESS', statusCode: 201 });
      } catch (error) {
        resolve({ status: false, msg: 'FAILED to generate response' });
      }
    });
  }

  async edit(Dto: UpdateBankDto) {
    try {
      const query = await this.neo
        .write(`MATCH (n:bank {bankId: "${Dto.bankId}"})
SET n.accountHolderName= "${Dto.accountHolderName}"
 RETURN n `);
      if (query.length > 0) {
        return {
          status: true,
          msg: 'successfully updated',
          data: query,
        };
      } else {
        return { staus: false, msg: 'faild' };
      }
    } catch (error) {
      ('error');
    }
  }
}
