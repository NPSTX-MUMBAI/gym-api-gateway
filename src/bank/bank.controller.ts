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
  constructor(private readonly bankSvc: BankService) {}

  @Post('add')  //Running
  create(@Body() createBankDto: CreateBankDto, userDto: SignUpDTO) {
    return this.bankSvc.create(createBankDto);
    // return this.bankSvc.create1(createBankDto);
  }

  @Get('list') //Running
  findAll() {
    return this.bankSvc.findAll();
  }

   // Banking Service  #1  Getting Bank Details by BankID
   @Get(':id') //Running
   findOne(
    @Param('id') id: string
    ) {
      return this.bankSvc.getBankDetailsById(id);
   }
 
    // Banking Service  #2  Getting Bank Names 
 
   // Banking Service  #3  Getting Bank Details From Gym ID

  //  @Get('account/:id')    //Check Relations
   //  getThree(@Param('id') id: string) {
   //    return this.bankSvc.getBankdetailsFrom(id);
   //  }

   @Get('account/:id')    //Not Working
   getTwo(@Param('id') id: string) {
     return this.bankSvc.getBankDetailsFromGymId(id);
   }

  @Patch('update/:id')    //Running
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.bankSvc.update(id, updateBankDto);
  }

  //Running
  @Delete('account/details/remove/:id')   
  remove(@Param('id') id: string) {
    return this.bankSvc.remove(id);
  }
}
