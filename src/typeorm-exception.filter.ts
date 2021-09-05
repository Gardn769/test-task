import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    if (exception) {
      response.status(400).json({ message: 'invalid inputs' });
    } else {
      response.status(500).json({ message: 'Internal error.' });
    }
  }
}
