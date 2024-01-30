import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable, Response } from '@nestjs/common';
import { Request,NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Response as CustomResponse } from '../dtos/response.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {


  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    console.log(req.headers)
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, "tatdaa");
    
      next();

    } else {
      throw new HttpException(new CustomResponse("failed",null,"Token Malformed"), HttpStatus.FORBIDDEN, {
        cause: new Error("Token Malformed")
      });
    }
  }
}