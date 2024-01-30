import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// This is a middleware for securing stripe and azure webhooks

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers.apikey;

    if (apiKey !== 'stripe') {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    next();
  }
}
