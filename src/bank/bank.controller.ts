import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post('add')  //Working
  create(@Body() createBankDto: CreateBankDto, userDto: SignUpDTO) {
    return this.bankService.create(createBankDto);
    // return this.bankService.create1(createBankDto);
  }


  @Get('list') //Working
  findAll() {
    return this.bankService.findAll();
  }

   // Banking Service  #1  Getting Bank Ids
   @Get(':id') //Running
   findOne(
    @Param('id') id: string
    ) {
     return this.bankService.getBankIds(id);
   }
 
    // Banking Service  #2  Getting Bank Names 
    @Get('banknames') //Runnning
    getBanknames() {
      return this.bankService.getBanknames();
    }
 
   // Banking Service  #3  Getting Bank Details From Gym ID
   @Get('account/:id')
   getTwo(@Param('id') id: string) {
     return this.bankService.getBankDetailsFromGymId(id);
   }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.bankService.update(+id, updateBankDto);
  }

  //Running
  @Delete('account/details/remove/:id')   
  remove(@Param('id') id: string) {
    return this.bankService.remove(id);
  }

 
}
