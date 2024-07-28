import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        function formatErrors(errors: ValidationError[]): Record<string, any> {
          return errors.reduce((acc, error) => {
            if (error.constraints) {
              acc[error.property] = Object.values(error.constraints);
            }
            if (error.children && error.children.length > 0) {
              acc[error.property] = formatErrors(error.children);
            }
            return acc;
          }, {});
        }

        const formattedErrors = formatErrors(validationErrors);
        return new BadRequestException({
          message: 'Помилка валідації',
          errors: formattedErrors,
          statusCode: 400,
        });
      },
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT || 8080);

  console.log(`Server is running on port: ${process.env.PORT}`);
}

bootstrap();
