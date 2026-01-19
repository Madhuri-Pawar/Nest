# Exception filters
- Nest comes with a built-in exceptions layer which is responsible for processing all unhandled exceptions across an application. - When an exception is not handled by your application code, it is caught by this layer, which then automatically sends an appropriate user-friendly response.
- this action is performed by a built-in global exception filter,which handles exceptions of type HttpException (and subclasses of it)

- When an exception is unrecognized (is neither HttpException nor a class that inherits from HttpException), the built-in exception filter generates the following default JSON response:


{
  "statusCode": 500,
  "message": "Internal server error"
}

# Throwing standard exceptions

- Nest provides a built-in HttpException class, exposed from the @nestjs/common package
- For typical HTTP REST/GraphQL API based applications, it's best practice to send standard HTTP response objects when certain error conditions occur

Let's assume that this route handler throws an exception for some reason. 

@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}

- When the client calls this endpoint, the response looks like this: (default json response structure statusCode & message)
{
  "statusCode": 403,
  "message": "Forbidden"
}

- The HttpException constructor takes two required arguments which determine the response:

    - The response argument defines the JSON response body.(string or object)
    - The status argument defines the HTTP status code.



@Get()
async findAll() {
  try {
    await this.service.findAll()
  } catch (error) {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }
}

response :
{
  "status": 403,
  "error": "This is a custom message"
}

# Custom exceptions
- custom exceptions inherit from the base HttpException class.


export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}

controller
- 
@Get()
async findAll() {
  throw new ForbiddenException();
}

Built-in HTTP exceptions
Nest provides a set of standard exceptions that inherit from the base HttpException

BadRequestException
UnauthorizedException
NotFoundException
ForbiddenException
NotAcceptableException
RequestTimeoutException
InternalServerErrorException
NotImplementedException
BadGatewayException
ServiceUnavailableException
GatewayTimeoutException

- All the built-in exceptions can also provide both an error cause and an error description using the options parameter:

throw new BadRequestException('Something bad happened', {
  cause: new Error(),
  description: 'Some error description',
});

response:
{
  "message": "Something bad happened",
  "error": "Some error description",
  "statusCode": 400
}


# Binding filters

The @UseFilters() decorator is imported from the @nestjs/common package.

Exception filters can be scoped at different levels: 
method-scoped of the 
- controller/resolver/gateway, 
- controller-scoped, or global-scoped

// controller method

@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}


// controller

@Controller()
@UseFilters(new HttpExceptionFilter())
export class CatsController {}

# global level

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


# module level


import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}


# Inheritance
- Typically, you'll create fully customized exception filters crafted to fulfill your application requirements. 
- simply extend the built-in default global exception filter, and override the behavior based on certain factors.

- all-exceptions.filter.ts

import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}

# Global filters can extend the base filter. This can be done in either of two ways.
1. The first method is to inject the HttpAdapter reference when instantiating the custom global filter:


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

2. Binding filters


✅ What is an Exception Filter?

👉 A layer that catches thrown errors and formats the response sent to client.

Used to:

    Standardize error responses

    Log errors

    Map internal errors to HTTP responses

Runs when:

    throw new Error()

    throw new HttpException()

✅ Role & Responsibility

Exception Filters should:

✅ Catch and handle errors

✅ Format response structure

✅ Map internal errors to safe messages

✅ Log errors (Sentry, CloudWatch, ELK)

❌ NOT fix business logic

❌ NOT retry logic


✅ Where It Fits in Request Lifecycle

Order (simplified):

Middleware → Guard → Interceptor → Controller → Service
⬇
❗ Exception Filter (only if error thrown)


✅ Q1: What is the default exception handler?

👉 Nest has built-in BaseExceptionFilter

    Handles HttpException

    Converts to HTTP response

✅ Q2: Difference between throw Error and throw HttpException?
Error	                 HttpException
Returns 500	                 Returns given status
No response format	           Custom response body
Not client safe          	Client safe

✅ Q3: How to apply Exception Filters?

    Controller level → @UseFilters()

    Global → app.useGlobalFilters()

✅ Q4: When should we create custom filters?

👉 When you need:

Common response format

Logging

Error mapping

Q5: Can Exception Filters work with non-HTTP apps?

✔ Yes
Supports:

    HTTP

    GraphQL

    Microservices (RPC)

Different host:

    host.switchToRpc()
    host.switchToHttp()


Q6: Difference: Interceptor vs Exception Filter?
Interceptor	                      Exception Filter
Handles success flow	            Handles error flow
Can transform response	            Only runs on error
Wraps method execution	             Catches thrown errors

Q7: How to map DB errors to HTTP errors?

👉 Catch DB error codes inside filter and convert:

Unique constraint → 409 Conflict
Not found → 404

const deploymentMap: Record<string, DeploymentInfo> = {
  BMS: {
    dbConnections: [DataBaseSourcesEnum.BMS],
    modules: [ServicesBmsApiModule],
    httpErrorCodeMap: [BMS_ERROR_MAP]
  },
};

export const AppModule = ApplicationBaseModule.forRoot(deploymentMap, [], 'bms');

export const BMS_ERROR_MAP = new Map([
  [BMSServiceErrorEnum.BROKER_NOT_FOUND, 404],
  [BMSServiceErrorEnum.MONTHLY_REPORT_NOT_FOUND, 404],
  [BMSServiceErrorEnum.BROKER_COMMISSION_TREE_NOT_FOUND, 404],
]);


Q8: How to avoid leaking internal error details?

👉 In filter:

Log full error internally

Send generic message to client


Q9: Order of multiple filters?

Controller filter runs first

Then global filter

-> Nearest filter wins.

Q10: How to handle async errors?

✔ No difference.
Async thrown errors are also caught by filters.

Q1: Why extend HttpException instead of Error?

👉 Only HttpException contains:

HTTP status

Response body

Plain Error always becomes 500.

Q2: Can Exception Filters catch custom exceptions?

✔ Yes — because they extend HttpException.

You can also target:

@Catch(UserBlockedException)


✅ Or Extend Built-in Exception (Best Practice)

export class InsufficientBalanceException extends BadRequestException {
  constructor() {
    super({
      message: 'Insufficient balance',
      errorCode: 'LOW_BALANCE',
    });
  }
}


✅ 1. Big Picture: Error Handling Stack in NestJS

When an error happens, Nest checks in this order:

🔹 A. What kind of error was thrown?

    HttpException (BadRequest, Forbidden, CustomHttpException)

    RpcException (microservices)

    Normal Error

    This decides:

        Status code

        Default response behavior

✅ 2. Exception Filters — Override Order (VERY IMPORTANT)

If multiple filters exist, closest one wins 👇

🎯 Priority Order

✅ Method-level filter
@UseFilters() on route

✅ Controller-level filter
@UseFilters() on controller

✅ Global filter (module / app)

❌ Default Nest exception handler

So:

Route Filter > Controller Filter > Global Filter > Nest Default


👉 If route filter handles it → others are NOT executed.

✅ 3. Exception Type vs Filter Matching
🔹 Filter catches only what it declares:
@Catch(BadRequestException) - Catches only BadRequest.

@Catch() - Catches everything (Error, HttpException, DB errors).

So execution is:

    Nest checks filters

    First matching filter handles exception

    Stops propagation

✅ 4. Full Request → Error → Response Flow
✅ Normal API Request Flow
Client
 ↓
Middleware
 ↓
Guard
 ↓
Interceptor (before)
 ↓
Pipe
 ↓
Controller
 ↓
Service
 ❗ ERROR THROWN
 ↓
Exception Filter
 ↓
HTTP Response

✅ What Happens When Error is Thrown
Step-by-step:

Error thrown in Controller or Service

Nest checks:

    Is it HttpException?

    Else treat as 500

    Find nearest matching Exception Filter

    That filter formats response

    Response sent to client

✅ 5. How Overrides Work (Real Example)
Scenario:

Global Filter → formats all errors

Controller Filter → handles DB errors

Route Filter → handles validation errors

If validation fails on route:

✔ Route filter handles → STOP
Global filter never runs.

If DB error in controller:

✔ Controller filter handles → STOP

If unknown error:

✔ Global filter handles

✅ 6. How Custom Exceptions Fit In

Your custom exceptions usually extend:

BadRequestException

ForbiddenException

or HttpException

So they are still:

👉 instanceof HttpException

Which means:

Default status is preserved

Filters can catch them by:

Specific class

Or HttpException

Or @Catch() (all)

✅ 7. What If No Custom Filter Exists?

Then Nest uses:

✅ Built-in BaseExceptionFilter

Behavior:

Error Type	          Result
HttpException	Uses its status + message
Error	        Returns 500
Unknown	        500

So app never crashes, always returns HTTP response.

✅ 8. API Gateway / Microservices Failure Flow

This is VERY important for fintech systems 👇

🔹 In Microservice

Service throws:

throw new RpcException({ code: 'USER_BLOCKED' });


Handled by:

RPC Exception Filters

🔹 At API Gateway

Gateway receives error from MS:

Usually as:

gRPC error

Kafka error

HTTP error

Then gateway should:

Catch MS error (in interceptor/service)

Convert to HttpException

Throw HttpException

Global HTTP Exception Filter formats response

👉 So each layer translates error type.

✅ 9. Where to Handle What (Senior Design)
Layer	                   Handles
Service	              Throws business exceptions
Controller          	Very rarely catches
Exception Filter       	Formats response + logs
Gateway	               Maps MS errors to HTTP

Never:

Swallow errors in services

Return { success:false } everywhere

✅ 10. Interview-Level Summary Flow
🎯 If API fails:
Service throws exception
→ Nest identifies exception type
→ Finds nearest matching filter
→ Filter formats response
→ Client receives error

🎯 If Microservice fails:
MS throws RpcException
→ Gateway receives error
→ Gateway maps to HttpException
→ Global HTTP filter formats
→ Client receives error

🎯 Strong Senior Interview Answer (You Can Say)

NestJS processes errors through a layered exception handling system where services throw domain or HTTP exceptions, Nest identifies the exception type, then applies the nearest matching exception filter based on scope. Route-level filters override controller and global filters. If no custom filter handles the error, Nest’s default BaseExceptionFilter converts it into an HTTP response. In microservice architectures, RPC exceptions are translated at the gateway into HTTP exceptions, which then follow the same filter pipeline.


# summary 

Exception Filters in NestJS provide a centralized way to handle and format errors. They catch both synchronous and asynchronous exceptions, allow mapping of internal errors to safe HTTP responses, and are commonly used for logging and standardizing API error formats. They complement interceptors, which handle successful responses, while filters focus purely on failure paths


const deploymentMap: Record<string, DeploymentInfo> = {
  BMS: {
    dbConnections: [DataBaseSourcesEnum.BMS],
    modules: [ServicesBmsApiModule],
    httpErrorCodeMap: [BMS_ERROR_MAP]
  },
};

export const BMS_ERROR_MAP = new Map([
  [BMSServiceErrorEnum.BROKER_NOT_FOUND, 404],
  [BMSServiceErrorEnum.MONTHLY_REPORT_NOT_FOUND, 404],
  [BMSServiceErrorEnum.BROKER_COMMISSION_TREE_NOT_FOUND, 404],
]);


export const AppModule = ApplicationBaseModule.forRoot(deploymentMap, [], 'bms');

provider:
{
  provide: ERROR_STATUS_CODE_MAP,
  useFactory: () => {
    return Object.values(deploymentMap).reduce(..., new Map());
  },
}

here useFactory at app start time build these map & stored it 

ERROR_STATUS_CODE_MAP-> DI token with instance cretaed at app start time

At runtime: 
 {
  provide: APP_FILTER,
  useClass: ServiceToHttpExceptionFilter,
}

🔥 Runtime Flow
Service throws error
→ Nest catches error
→ Finds global APP_FILTER
→ Calls ServiceToHttpExceptionFilter.catch()
→ Filter maps error → HTTP response
→ Response sent

Case 1: ServiceErrorException
-So business error code → mapped to HTTP status using config map.
case 2: axios error (When downstream API fails:)
External service error → axios error → gateway maps to HTTP


- service layer
- transform error if QueryFailedError
- else throw rest of error

@Post()
async createPayment(@Body() dto: CreatePaymentDto) {
  try {
    return await this.paymentsService.create(dto);
  } catch (err) {
    if (err instanceof QueryFailedError) {
      throw new ServiceErrorException({
        errorCode: 10012,
        message: 'Duplicate transaction',
      });
    }

    throw err;
  }
}

- This throw error comes to app filter
- Now your global filter will map:
- 10012 → HTTP 409 (from errorStatusMap)

✅ How It Works With Global Filter
Controller try/catch
   ↓
Throw error (original or transformed)
   ↓
Nest exception layer
   ↓
Global Exception Filter
   ↓
HTTP response

- So controller never sends response directly — only throws.

# Res() -> take responsibility of response to client by own global execption ignored

✅ If You Use @Res() — Does It Bypass Global Filters?
👉 Short Answer

✅ Yes — if you manually send the response using res.status().send()/json(), 
Nest considers 
- the response handled and 
- exception filters will NOT run for that request.
- nest think developer already handled response 
- Controller writes response → Nest pipeline stops → Filters skipped

This BYPASSES filters only if you actually send response:
- res.status(400).json(...)

@Res() res: Response
throw new BadRequestException();

- nest execpt you to finish response
==========================================

✅ How to Use @Res() Without Breaking Filters

Use passthrough mode 👇

@Post()
async test(@Res({ passthrough: true }) res: Response) {
  res.setHeader('x-test', '123'); // ok
  return { ok: true };           // Nest still handles response
}


Now:

    Filters still work

    Interceptors still work

    You can only modify headers/cookies (imp)


@Catch 
- added on global execption filter who catch all app errors

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // common error format
  }
}

Resistered using :
{
  provide: APP_FILTER,
  useClass: GlobalExceptionFilter,
}

Handles:

    HttpException

    Business exceptions

    Axios errors

    Unknown errors

# class validator DTO level errors

- DTO error not goes into controller catch block
- This error direct goes to Custom Validation Pipe if error find then transforms that error with message like "Name must required"
- like below
new ValidationPipe({
  exceptionFactory: (errors) => new ServiceErrorException(...)
})

- Then this error goes to global execption filters
- Then your global filter maps business error.

- summary
DTO validation errors are thrown by validation pipes before the controller executes, so they bypass controller try–catch blocks and are handled directly by exception filters, typically at the global level.