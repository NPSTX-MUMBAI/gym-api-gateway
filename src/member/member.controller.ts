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

@Controller('members')
export class MemberController {
  constructor(private readonly memberSvc: MemberService) { }

<<<<<<< HEAD
  @Post('/create')
  async create(@Body() createMemberDto: CreateMemberDto) {
    return await this.memberService.create(createMemberDto);
=======
  // @Post('/account/add')
  // create(@Body() createMemberDto: CreateMemberDto) {
  //   return this.memberSvc.create2(createMemberDto);
  // }


  @Post('create')
  create(
    // @Param('id') id:string,
    @Body() createMemberDto: CreateMemberDto) {
    return this.memberSvc.create(createMemberDto)
>>>>>>> 903463badc3e04777d22ceff3d6b77434e8a271e
  }



  @Get('/all')    //Running
  async findAll() {
    return await this.memberSvc.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
  findOne(@Param('id') id: CreateMemberDto) {
    return this.memberService.findmemberbygymID(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return await this.memberService.update(id, updateMemberDto);
=======
  findOne(@Param('id') id: string) {
    return this.memberSvc.findOne(id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return await this.memberSvc.update(id, updateMemberDto);
>>>>>>> 903463badc3e04777d22ceff3d6b77434e8a271e
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
