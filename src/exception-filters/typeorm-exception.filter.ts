import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(EntityNotFoundError, QueryFailedError)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof EntityNotFoundError) {
      response.status(400).json({ message: 'entity not found' });
    }

    if (exception instanceof QueryFailedError) {
      response.status(400).json({ message: 'oops something goes wrong' });
    }

    if (!exception) {
      response.status(500).json({ message: 'Internal error.' });
    }
  }
}
