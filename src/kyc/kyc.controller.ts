import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UploadedFiles, Req, BadRequestException } from '@nestjs/common';
import { KycService } from './kyc.service';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { imageFileFilter } from './file-helper';

import { Express } from 'express';
 

// const getStream = require('into-stream')
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  // @Post()
  // create(@Body() createKycDto: CreateKycDto) {
  //   return this.kycService.create(createKycDto);
  // }

  // @Post()
  // @UseInterceptors(
  //   FilesInterceptor('image',10,{
  //     storage:diskStorage({}),
  //     fileFilter:
  //   }),
  // )
    

  Here
    @Post('/upload')
    
    @UseInterceptors(
      FileInterceptor('image',{

        fileFilter:imageFileFilter
      }),
    )

  public uploadFile(
    @Req() req:any,
    @UploadedFile() file:Express.Multer.File) {
    
    if(file || req.fileValidationError ) {
      throw new BadRequestException('Invalid File Provided,[image file allowed]')
    }
    
    const buffer = file.buffer;
    // const stream = getStream(file.buffer);



  } 


  


  // @Post('/multiple-uploads')
  //   @UseInterceptors(
  //     FilesInterceptor('image',10,{
  //       storage:diskStorage({
  //         // destination:'./assets/',
  //         destination:'~/Desktop/Angular Apps/Gym App/gym-api-gateway-7/gym-api-gateway/src/assets/Nutrients1.ods',

  //         // filename:''

  //       }),
  //       fileFilter:imageFileFilter
  //     }),
  //   )

  // public uploadMultipleFiles(@UploadedFiles() files:any) {
    
  //   const response:any = [];
  //   files.array.map(file => {
  //     const fileResponse = {
  //       originalname : file.originalname,
  //       filename :file.filename,
  //     };
  //     response.push(fileResponse);
  //   });
  //   return response;
  // }


  // @Get()
  // findAll() {
  //   return this.kycService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.kycService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateKycDto: UpdateKycDto) {
  //   return this.kycService.update(+id, updateKycDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.kycService.remove(+id);
  // }
}
