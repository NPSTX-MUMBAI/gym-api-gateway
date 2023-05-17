import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { AuthGuard } from '@nestjs/passport';
import { USER_ROLE } from 'src/auth/dtos/signup.dto';
import { HasRoles } from 'src/auth/has-role.decorator';
import { BankService } from 'src/bank/bank.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { log } from 'console';

@Controller('gym')
export class GymController {
  constructor(private readonly gymSvc: GymService) { }

  // @UseGuards(AuthGuard('jwt'))
  // @HasRoles(USER_ROLE.ADMIN)
  @Post('/create') //Running
  async create(@Body() createGymDto: CreateGymDto) {
    console.log('inside create gym controller=>', createGymDto);

    return await this.gymSvc.create(createGymDto);
  }
  // @HasRoles(USER_ROLE.ADMIN)
  // @UseGuards(AuthGuard('jwt'))

  @Get('/all')
  async findAll() {
    return await this.gymSvc.findAll();
  }


  @Get(':id')           //Running
  async findOne(@Param('id') id: string) {
    console.log(id);
    // return await this.gymService.findOne(id);
    return this.gymSvc.findById(id);
  }

  @Get('details/:id')     //Running   
  getGymdetailsByBankID(@Param('id') id: string) {
    return this.gymSvc.getGymdetailsByBankID(id);
  }

  // @Get('/email/:email')   //Last
  // async findAllGymForCurrentUser(@Param('email') email: string) {
  //   return await this.gymService.findAllGymForCurrentUser(email)
  // }







  @Post('detachsvc')
  detachService(
    @Body()
    gymDto: CreateGymDto) {
    return this.gymSvc.detachService(gymDto);
  }


  //Running
  @Delete('account/details/delete/:id')
  remove(@Param('id') id: string) {
    return this.gymSvc.remove(id);
  }




  @Get('/user/:id')
  async findAllGymForCurrentUser(@Param('id') userId: string) {
    return await this.gymSvc.findAllGymForCurrentUser(userId);
  }

  @Get('/findaddress/:id')
  async findGymAddress(@Param('id') email: string) {
    return await this.gymSvc.getGymAddress(email);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
    console.log(id, updateGymDto);

    return await this.gymSvc.update(id, updateGymDto);
  }

  @Get('update2/:id')
  async update2(@Param('id') id: string) {
    console.log(id);
    return id;
  }

  @Patch('/update/address/:id')
  async updateAddress(
    @Param('id') id: string,
    @Body() updateGymDto: UpdateGymDto,
  ) {
    return await this.gymSvc.updateAddress(id, updateGymDto);
  }


}
