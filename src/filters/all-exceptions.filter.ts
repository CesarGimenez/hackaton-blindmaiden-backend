import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // When an exception (error) is thrown, it will be caught by this filter and handled here to return a custom response
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Get the context HTTP
    const response = ctx.getResponse<Response>(); // Get the response of the context
    const request = ctx.getRequest<Request>(); // Get the request of the context
    let status =
      exception?.status ||
      exception?.response?.status ||
      HttpStatus.INTERNAL_SERVER_ERROR; // If there's no status in the exception?, use 500 as default
    let message =
      exception?.response?.message ||
      exception?.message ||
      'Internal server error'; // If there's no message in the exception, use 'Internal server error'

    if (exception?.code === 11000) {
      // This is a MongoDB duplicate key error code, if happens we return a 409 and a custom message
      status = HttpStatus.CONFLICT;
      console.log(exception);
      message = 'Valor duplicado, ya existe un registro con ese valor';

      if (exception?.message.includes('phone_one')) {
        message =
          'Este número de teléfono ya se encuentra registrado, por favor contacte a atención al cliente';
      }
    }

    if (exception?.status === 401) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'No autorizado.';
    }

    // Return the custom response for all exceptions
    response.status(status).json({
      statusCode: status,
      typeError: exception?.name,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorDetail: Array.isArray(message) ? message[0] : message,
    });
  }
}
