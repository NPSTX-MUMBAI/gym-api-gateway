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

  // @Post('add')  //Working
  // create(@Body() createBankDto: CreateBankDto, userDto: SignUpDTO) {
  //   return this.bankService.create1(createBankDto);
  //   // return this.bankService.create1(createBankDto);
  // }

  @Post('create/relation/:id')
  createR(@Param (':id') id:string, name:string) {
    this.bankService.createR(id,name);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.bankService.update(+id, updateBankDto);
  }

  @Delete('account/remove/:id')   
  remove(@Param('id') id: string) {
    return this.bankService.remove(id);
  }

 
}
