import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { AzureApiResponse } from 'src/domain/dtos/azureapiresponse';
import { Response } from 'src/domain/dtos/response.dto';
import { UserDto, UserEditDto } from 'src/domain/dtos/user.dto';
import UserService from './user.service';
import { AzureAuthServiceMiddleware } from 'src/infrastructure/azure/azure.auth.servicemiddleware';
import { FileInterceptor } from '@nestjs/platform-express';





@ApiBearerAuth() //edit here

@Controller('/users')

@ApiTags('users')
@UseGuards(AzureAuthServiceMiddleware)

export default class UserController {
  constructor(private userService: UserService) {}

  @Get("/:uniqueId")
  @ApiParam({name: 'uniqueId', required: true, description: 'Azure AD unique Id of the user', schema: { oneOf: [{type: 'string'}]}})
  getUserByUniqueId(@Param('uniqueId') uniqueId) {
    return this.userService.getUserByUniqueId(uniqueId);
 
  }

  @Patch("/:uniqueId")
  @ApiParam({name: 'uniqueId', required: true, description: 'Azure AD unique Id of the user', schema: { oneOf: [{type: 'string'}]}})
  updateUserByUniqueId(@Param('uniqueId') uniqueId,@Body() UserDto: UserEditDto) {
    return this.userService.updateUser(uniqueId,UserDto);
 
  }

  @Patch("/image/:uniqueId")
 @ApiConsumes('multipart/form-data')
 @ApiBody({
   schema: {
     type: 'object',
     properties: {
      
       file: {
         type: 'string',
         format: 'binary',
       },
     },
   },
 })
 @UseInterceptors(FileInterceptor('file'))
  @ApiParam({name: 'uniqueId', required: true, description: 'Azure AD unique Id of the user', schema: { oneOf: [{type: 'string'}]}})
  updateUserProfilePic(@Param('uniqueId') uniqueId,@UploadedFile() file: Express.Multer.File & { buffer: Buffer }) {
    return this.userService.updateUserImage(uniqueId,file);
 
  }


 
}
