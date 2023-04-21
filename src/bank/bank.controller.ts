
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post('add')
  create(@Body() createBankDto: CreateBankDto,userDto:SignUpDTO) {
    // return this.bankService.create(createBankDto);
    return this.bankService.create(createBankDto);
  }

  @Get('list')    //Running
  findAll() {
    return this.bankService.findAll();
  }

  @Get('bankIDs')   //Running
  getBankIds() {
    return this.bankService.findBankId();
  }

  @Get('banknames') //Runnning
  getBanknames() {
   return this.bankService.getBanknames();
  }
  

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bankService.findOne(+id);
  // }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.bankService.update(+id, updateBankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankService.remove(+id);
  }
}
