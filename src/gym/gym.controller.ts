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
import { AssociateSvcDto } from 'src/services/dto/associateService.dto';
import { ServiceDTO } from 'src/services/dto/service.dto';

@Controller('gym')
export class GymController {
  constructor(private readonly gymSvc: GymService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @HasRoles(USER_ROLE.ADMIN)
  @Post('/create') //Running
  async create(@Body() createGymDto: CreateGymDto, svcDto: AssociateSvcDto) {
    console.log('inside create gym controller=>', createGymDto);

    // return await this.gymSvc.create(createGymDto,svcDto)
    return await this.gymSvc.create(createGymDto);
  }

  //Attach Service with Gym
  @Post('attachsvc')
  attachService(
    @Body()
    gymDto: CreateGymDto,
  ) {
    return this.gymSvc.attachSvc(gymDto);
  }

  //Detach Service with Gym
  @Post('detachsvc')
  detachService(
    @Body()
    gymDto: CreateGymDto,
  ) {
    return this.gymSvc.detachSvc(gymDto);
  }

  @Post('addservice')       
  addService(
    @Body() 
    createServiceDto:ServiceDTO,
    gymDto:CreateGymDto
    ) {
    // return 'This action adds a new owner';

      this.gymSvc.addCustomService(createServiceDto)
    
  }

  @Post('addowner')
  addOwner(
    @Body() gymDto:CreateGymDto
  ) {
    return this.gymSvc.addOwner(gymDto);
  }

  // @HasRoles(USER_ROLE.ADMIN)
  // @UseGuards(AuthGuard('jwt'))
  @Get('/all') //Running
  async findAll() {
    return await this.gymSvc.findAll();
  }

  @Get(':id') //Running
  async findOne(@Param('id') id: string) {
    console.log(id);
    // return await this.gymService.findOne(id);
    return this.gymSvc.findById(id);
  }

  @Get('details/:id') //Running
  getGymdetailsByBankID(@Param('id') id: string) {
    return this.gymSvc.getGymdetailsByBankID(id);
  }

  // @Get('/email/:email')   //Last
  // async findAllGymForCurrentUser(@Param('email') email: string) {
  //   return await this.gymService.findAllGymForCurrentUser(email)
  // }

  @Get('user/:id')
  async findAllGymForCurrentUser(@Param('id') userId: string) {
    return await this.gymSvc.findAllGymForCurrentUser(userId);
  }

  @Get('/findaddress/:id') //Running
  async findGymAddress(@Param('gymId') gymId: string) {
    return await this.gymSvc.getGymAddress(gymId);
  }

  @Patch('/update/:id') //Running
  async update(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
    return await this.gymSvc.update(id, updateGymDto);
  }

  @Patch('/update/address/:id') //Problematic
  async updateAddress(
    @Param('id') id: string,
    @Body() updateGymDto: UpdateGymDto,
  ) {
    return await this.gymSvc.updateAddress(id, updateGymDto);
  }

  //Running
  @Delete('account/details/delete/:id')
  remove(@Param('id') id: string) {
    return this.gymSvc.remove(id);
  }

  @Get()
  getSvcByGymID(
    @Body()
    dto: CreateGymDto,
  ) {
    this.gymSvc.getGymSvcList(dto);
  }
}
