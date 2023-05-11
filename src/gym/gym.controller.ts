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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { log } from 'console';

@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @HasRoles(USER_ROLE.ADMIN)
  @Post('/create') //Running
  async create(@Body() createGymDto: CreateGymDto) {
    console.log('inside create gym controller=>', createGymDto);

    return await this.gymService.create(createGymDto);
  }

  // @HasRoles(USER_ROLE.ADMIN)
  // @UseGuards(AuthGuard('jwt'))

  @Get('/all')
  async findAll() {
    return await this.gymService.findAll();
  }

  @Get(':id') //Find ID
  async findOne(@Param('id') id: string) {
    console.log(id);
    // return await this.gymService.findOne(id);
    return this.gymService.findOne(id);
  }

  // @Get('/email/:email')
  // async findAllGymForCurrentUser(@Param('email') email: string) {
  //   return await this.gymService.findAllGymForCurrentUser(email);
  // }

  @Get('/user/:id')
  async findAllGymForCurrentUser(@Param('id') userId: string) {
    return await this.gymService.findAllGymForCurrentUser(userId);
  }

  @Get('/findaddress/:id')
  async findGymAddress(@Param('id') email: string) {
    return await this.gymService.getGymAddress(email);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
    console.log(id, updateGymDto);

    return await this.gymService.update(id, updateGymDto);
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
    return await this.gymService.updateAddress(id, updateGymDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gymService.remove(id);
  }
}
