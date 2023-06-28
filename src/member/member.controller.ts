import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common/decorators';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common/pipes';
import { FileExtensionValidator } from './validators/fileextn.validator';
import { FileHeaderValidator } from './validators/fileheader.validator';
import { log } from 'console';
import { CreateBodydto } from './dto/body-parameter.dto';
import { updateBodyparameter } from './dto/updateBody-parameter.dto';
import { CreatePlandto } from './dto/plan.dto';
import { ServiceDTO } from 'src/package/dto/service.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('/create')
  async create(@Body() createMemberDto: CreateMemberDto) {
    return await this.memberService.create(createMemberDto);
  }
  @Post('/addBody')
  async addBody(@Body() createBody: CreateBodydto) {
    return await this.memberService.addbodyParameters(createBody);
  }
  
  @Get('bodylist/:id')

 findBodyParameterbyMemberId(@Param('id') userId: string) {

return this.memberService.findBodyParameterbyMemberId(userId);

 }

  @Get('/all')
  async findAll() {
    return await this.memberService.findAll();
  }
  @Get('/alldurationplan')
  async getAllduration() {
 return await this.memberService.getAllduration();
}

  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.memberService.findmemberbygymID(id);
  }
  @Patch('body/:id')
  async updateBody(
    @Param('id') id: string,

    @Body() updateBodyParameter: updateBodyparameter,
  ) {
    return await this.memberService.updateBody(id, updateBodyParameter);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return await this.memberService.update(id, updateMemberDto);
  }

  //Running
  @Delete('account/delete/:id')
  async remove(@Param('id') id: string) {
    return await this.memberService.remove(id);
  }
  @Post('/attachservicetomember')

  async attacsvc(@Body() createBody: CreateMemberDto) {

    return await this.memberService.attachserivcetomember(createBody);

  }
  @Post('/createplanduration')

  async addPlan(@Body() createPlan: CreatePlandto) {

    return await this.memberService.adddurationPlan(createPlan);

  }
  @Post('/attachservicemem')

  async attacsvcmem(@Body() createBody: ServiceDTO) {

    return await this.memberService.attachServicesMEM(createBody);

  }
  @Post('/attachplantomember')

  async attachplan(@Body() createPlan: CreatePlandto) {

    return await this.memberService.attachplantomember(createPlan);

  }
  // @Post('/imageupload')
  // @UseInterceptors(FileInterceptor('image', {
  //   dest: '/images'
  // }))
  // uploadPics(@UploadedFile(new ParseFilePipe({
  //   validators: [
  //     new FileTypeValidator({
  //       fileType: 'image/png'
  //     }),
  //     new MaxFileSizeValidator({
  //       maxSize: 2000000
  //     }),

  //   ]
  // })) file: Express.Multer.File) {
  //   console.log(file);
  //   return "image uploaded successfully"
  // }

  @Post('/bulkupload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './bulkuploadata',
    }),
  )
  uploadMembers(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000,
          }),
          new FileExtensionValidator({
            extensions: ['xls', 'xlsx', 'csv'],
          }),
          new FileHeaderValidator({
            headers: ['firstName', 'lastName', 'email', 'mobileNo'],
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    //todo: service invocation to parse file content and store in database.

    return 'file uploaded successfully';
  }
}
