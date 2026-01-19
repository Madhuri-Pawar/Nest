# Pipes
- A pipe is a class annotated with the @Injectable() decorator, which implements the PipeTransform interface.

- Pipes have two typical use cases:
    - transformation: transform input data to the desired form (e.g., from string to integer)
    - validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception

# IMP
- Pipes run inside the exceptions zone. 
- This means that when a Pipe throws an exception it is handled by the exceptions layer (global exceptions filter and any exceptions filters that are applied to the current context). 
- it should be clear that when an exception is thrown in a Pipe, no controller method is subsequently executed.

Built-in pipes#
Nest comes with several pipes available out-of-the-box:

ValidationPipe
ParseIntPipe
ParseFloatPipe
ParseBoolPipe
ParseArrayPipe
ParseUUIDPipe
ParseEnumPipe
DefaultValuePipe
ParseFilePipe
ParseDatePipe

# Binding pipes
 - pass direct pipe class like ParseIntPipe

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
    }

- Router execute : 
    GET localhost:3000/abc

- Nest will throw an exception like this:
   {
    "statusCode": 400,
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request"
    }

- Pass instance of pipe class & add custom error message

    @Get(':id')
    async findOne(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
    ) {
    return this.catsService.findOne(id);
    }

 
@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return this.catsService.findOne(uuid);
}

# Custom pipes
-  note that the transform() method is marked as async
- This is possible because Nest supports both synchronous and asynchronous pipes.

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}

export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}

# validation pipe
- on controller 
- on mapping or transformation 

  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))

const params : ApplicationParams = {
    module: AppModule,
    appName: "Data",
    description: "Data api",
    port: 3000,
    validationPipe: new ValidationPipe({ whitelist: true, transform: true })
}

- For http request validations we have class-validators pipes used internally

# Global scoped pipes

- Global pipes are used across the whole application, for every controller and every route handler.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

✅ Scenario 1: Convert string ID to number & reject invalid

✅ Scenario 2: Trim & sanitize input fields

    User sends name with spaces:

    { "name": "   Madhuri   " }


    Before saving:

        trim spaces

        reject empty after trim

    🎯 Pipe Purpose:

        Input sanitation globally.

        💡 Pipe:

        if string → trim()

        if empty → error

# summary
We use custom pipes when validation or transformation logic is reusable, should run before controller execution, and must be independent of business services. Pipes are ideal for type casting, sanitization, and enforcing request-level business constraints like amount limits or date formats.