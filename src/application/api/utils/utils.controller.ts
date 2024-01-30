import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

import { AzureAuthServiceMiddleware } from 'src/infrastructure/azure/azure.auth.servicemiddleware';
import * as countries from "./countries.json";
import * as countriesCode from "./countryCode.json";

import { Response } from 'src/domain/dtos/response.dto';



@ApiBearerAuth() 

@Controller('utils')

@ApiTags('utils')
@UseGuards(AzureAuthServiceMiddleware)

export default class UtilsController {

  @Get("country")
  getCountryList() {
    return new Response("success",countries,null);
 
  }

  @Get("countrycode")
  getCountryCodeList() {
    return new Response("success",countriesCode,null);
 
  }

 

 
}
