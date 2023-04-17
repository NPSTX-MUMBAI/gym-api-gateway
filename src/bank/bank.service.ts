import { Injectable } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Neo4jService } from '@brakebein/nest-neo4j';

@Injectable()
export class BankService {
  constructor(private neo: Neo4jService) {}
  async create(Dto: CreateBankDto) {
    try {
      const query = await this.neo
        .write(`merge (b:bank {accountHoldername: "${Dto.accountHoldername}"
accountType: "${Dto.accountType}"
accountNo: "${Dto.accountNo}"
ifsc: "${Dto.ifsc}"
mid: "${Dto.mid}"
bankname: "${Dto.bankname}"
branchname: "${Dto.bankname}"
}) return b`);
      if (query.length > 0) {
        return { data: query, msg: 'Bank Created', status: true };
      } else {
        return `false`;
      }
    } catch (error) {
      return `fALSEs`;
    }
  }

  findAll() {
    return `This action returns all bank`;
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
