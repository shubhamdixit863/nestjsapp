/**
 * This controller acts as an api connector for azure
 *
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  Headers,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AzureApiResponse } from 'src/domain/dtos/azureapiresponse';
import { UserDto } from 'src/domain/dtos/user.dto';
import UserService from '../user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/infrastructure/azure/file.upload.service';
import { Response } from 'src/domain/dtos/response.dto';
import { AzureGraphService } from 'src/infrastructure/azure/azure.graph.service';
import AzureService from './azure.service';
import { AzureAuthServiceMiddleware } from 'src/infrastructure/azure/azure.auth.servicemiddleware';
import { Response as ExpressResponse } from 'express';
import { CodeDto, RefereshTokenDto } from 'src/domain/dtos/azure.code';
import { v4 as uuidv4 } from 'uuid';

@Controller('/azure')
@ApiTags('azure')
export default class AzureController {
  constructor(
    private userService: UserService,
    private readonly blobStorageService: FileUploadService,
    private readonly azureGraphService: AzureGraphService,
    private readonly azureService: AzureService,
    private readonly azureAuthService: AzureAuthServiceMiddleware,
  ) {}

  @ApiOperation({ summary: 'Validate Token' })
  @Head('/validate')
  async validateToken(
    @Headers('token') token: string,
    @Res() res: ExpressResponse,
  ) {
    // Check if the authorization header exists
    if (!token) {
      return res.status(401);
    }

    this.azureAuthService.validateJwt(token, (err, result) => {
      if (err) {
        return res.status(401).send();
      }
      return res.status(200).send();
    });
  }

  @Post('/auth')
  async create(@Body() userDto: UserDto) {
    console.log("Api called---Webhook")
    // check whether the user exists or not
    const userExists = await this.userService.getUserByUniqueId(
      userDto.objectId,
    );

    if (!userExists.data) {
      const userDataAzureGraph = await this.azureGraphService.getUser(
        userDto.objectId,
      );
      //console.log('azure graph', userDataAzureGraph);
      userDto.city = userDataAzureGraph['city'];
      userDto.country = userDataAzureGraph['country'];

      const identities = userDataAzureGraph?.identities?.find(
        (ele) => ele.signInType === 'emailAddress',
      );
      const signInType = userDataAzureGraph?.identities?.find(
        (ele) => ele.signInType === 'federated',
      );
      if (identities) {
        userDto.email = identities.issuerAssignedId;
      }

      if (signInType) {
        userDto.signInType = 'federated';
      }

      userDto.displayName =
        userDataAzureGraph['displayName'] || userDataAzureGraph['givenName'];

      userDto.name =
        userDataAzureGraph['displayName'] || userDataAzureGraph['givenName'];
        userDto.clientId=uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

      // Save the user in the database
      let user = await this.userService.create(userDto);

      // Send Welcome Email Here to the user --
      await this.azureService.sendWelcomeEmail(userDto.email, userDto.name);
    }

    let [resultRolePermission, products] = await Promise.all([
      this.azureService.GetUserPermissions(userDto.objectId),
      this.azureService.getUserSubscription(userDto.objectId),
    ]);
    console.log({
      productsSubscribed: products,
      permissions: resultRolePermission.permissions,
      roles: resultRolePermission.roles,
      userEmail: userDto.email,
      clientId:userDto.clientId || userExists.data["clientId"]
    })
    return {
      productsSubscribed: products,
      permissions: resultRolePermission.permissions,
      roles: resultRolePermission.roles,
      userEmail: userDto.email,
      clientId:userDto.clientId || userExists.data["clientId"]
    };
  }

  @Post('/upload')
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File & { buffer: Buffer },
  ): Promise<any> {
    const data = await this.blobStorageService.uploadFileToBlobStorage(file);
    return new Response('success', data, null);
  }

  @Get('read')
  async readImage(@Res() res, @Query('filename') filename) {
    const file = await this.blobStorageService.getfileStream(filename);
    return file.pipe(res);
  }

  @ApiOperation({
    summary:
      'Issue the code from authorize flow the interactive ui ,enter the code in the url to get the access token',
  })
  @Post('/accessToken')
  getAccess(@Body() codeDto: CodeDto) {
    const { code } = codeDto;
    return this.azureService.GetAccessTokenAzure(code);
  }

  @ApiOperation({
    summary:
      'Pass the referesh token generate from accesstoken api to get the referesh token',
  })
  @Post('/refreshToken')
  getRefreshToken(@Body() codeDto: RefereshTokenDto) {
    const { refreshToken } = codeDto;
    return this.azureService.GetRefereshTokenAzure(refreshToken);
  }
}
