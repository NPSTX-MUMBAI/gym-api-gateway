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

@Controller('member')
export class MemberController {
  constructor(private readonly memberSvc: MemberService) { }

  @Post('/create')
  async create(@Body() createMemberDto: CreateMemberDto) {
    return await this.memberSvc.create(createMemberDto);
  }
  @Post('/addBody')
  async addBody(@Body() createBody: CreateBodydto) {
    return await this.memberService.addbodyParameters(createBody);
  }
  
  @Get('bodylist/:id')

 findBodyParameterbyMemberId(@Param('id') userId: string) {

return this.memberService.findBodyParameterbyMemberId(userId);

 }



  @Get('/all')    //Running
  async findAll() {
    return await this.memberSvc.findAll();
  }

  @Get(':id')

  findOne(@Param('id') id: any) {

    return this.memberSvc.findmemberbygymID(id);
  }
  @Patch('body/:id')
  async updateBody(
    @Param('id') id: string,

    @Body() updateBodyParameter: updateBodyparameter,
  ) {
    return await this.memberService.updateBody(id, updateBodyParameter);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return await this.memberSvc.update(id, updateMemberDto);
  }




  //Running
  @Delete('account/delete/:id')
  async remove(@Param('id') id: string) {
    return await this.memberSvc.remove(id);
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
